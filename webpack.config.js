var path = require("path");
var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');
var WebpackBrowserPlugin = require('webpack-browser-plugin');

var minifyPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false,  //不显示编译后的警告
        global_defs: { // global definitions
            DEBUG: false
        }
    },
    parse: {
        strict: true,              // default is false
    },
    output: {
        beautify: false, // beautify output?
        comments: false, // output comments?
    },
    mangle: {                      // 混淆的变量名
        except: ['COMMON', 'Menu', 'console', 'jQuery', 'Zepto', 'Router', '$', 'exports', 'require']  //除去
    }
});

var noErrorsPlugin = new webpack.NoErrorsPlugin();

//依赖注入，全局对象
var dependencyInjection = new webpack.DefinePlugin({
    VERSION: JSON.stringify("5fa3b9"),
    BROWSER_SUPPORTS_HTML5: true,
    TWO: "1+1",
    "typeof window": JSON.stringify("object"),
    "process.env": {
        NODE_ENV: JSON.stringify("production")
    }
});

//Automatically loaded modules. Module (value) is loaded when the identifier (key) is
// used as free variable in a module.
// in a module
//$("#item") // <= just works
// $ is automatically set to the exports of module "jquery"
var providePlugin = new webpack.ProvidePlugin({
    React: "react",
    ReactDOM: "react-dom",
    //$: path.join(__dirname, './resources/views/manager/js/common/zepto.min.js' ),
    $: 'jquery',
});

//Fires shell commands before and after webpack builds.
var ShellPlugin = new WebpackShellPlugin({
    onBuildStart: ['echo "webpack compile Starting"'],
    onBuildEnd: ['echo "webpack compile Ending"'],  //'python script.py && node script.js'
    onBuildExit: ['echo "webpack compile Exited"']
});

//For webpack, browser-sync is being used.
var webpackBrowserPlugin = new WebpackBrowserPlugin({
    browser: 'Firefox',
    port: 9000
});

// 样式通过 <link> 引入，而不是放在 <style> 标签内
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    entry: {
        //'vender.min': [
        //    //'./resources/views/manager/js/common/zepto.min.js',
        //    './resources/views/manager/js/common/common.js',
        //    './resources/views/manager/js/common/director.min.js',
        //    './resources/views/manager/js/module/route.js',
        //    './resources/views/manager/js/vendor/menu.js',
        //
        //],
        'index.min': "./resources/views/manager/js/react/module/index/dist/index.js",
        'newProduct.min': "./resources/views/manager/js/react/module/newProduct/dist/newProduct.js",
    },
    output: {
        path: path.join(__dirname, "./resources/views/manager/js/dist/component"), //打包输出的路径
        filename: '[name].js', //"bundle.js",                   //打包后的名字
        //publicPath: "./resources/views/manager" //网站运行时的访问路径

    },
    noParse: [
        /XModule[\\\/]file\.js$/,
        path.join(__dirname, "web_modules", "XModule2"),
        //path.join(__dirname, 'resources/views/manager/js/common/zepto.min.js'),
    ],
    resolve: {  // 自动添加扩展名
        extensions: ['', '.js', '.jsx'],
        alias: {
            // 把用户的一个请求重定向到另一个路径
            // require('moment'); 其实就等价于 require('moment/min/moment-with-locales.min.js');
            moment: "moment/min/moment-with-locales.min.js"
        }
    },
    plugins: [
        //minifyPlugin,
        noErrorsPlugin,
        ShellPlugin,
        dependencyInjection,
        providePlugin,
        //提取多个页面之间的公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common.min',
            minChunks: 2
        }),  // 来提取多个页面之间的公共模块，并将该模块打包
        //  new ExtractTextPlugin("[name].css")  // 样式通过 <link> 引入，而不是放在 <style> 标签内
        //  new ExtractTextPlugin("style.css", {allChunks: true})  // 所有独立样式打包成一个css文件
    ],
    //*大于8KB的图片不会被打包，所以一般会被打包的都是一些css文件引入的icon图标或者logo什么的
    //在对模块捆绑打包的过程中会对文件的后缀名进行检测，然后进行相应的预处理
    module: {
        loaders: [

            //  "webpack": "webpack --progress --colors --watch --profile --display-modules"

            //#installing the babel-core and babel-loader packages:
            //  npm install babel-core babel-loader --save-dev

            //# For ES6/ES2015 support
            //  npm install babel-preset-es2015 --save-dev

            //# If you want to use JSX
            //  npm install babel-preset-react --save-dev

            //# If you want to use experimental ES7 features
            //  npm install babel-preset-stage-0 --save-dev

            //# In particular, the new ES6 built-ins like Set, Map and Promise must be polyfilled
            //  npm install babel-polyfill --save

            //# Babel also bakes a number of smaller helpers directly into your compiled code.
            // This is OK for single files, but when bundling with Webpack, repeated code will
            // result in a heavier file size. It is possible to replace these helpers with
            // calls to the babel-runtime package by adding the transform-runtime plugin:
            //  npm install babel-runtime --save
            //  npm install babel-plugin-transform-runtime --save-dev

            //{
            //    loader: "babel-loader",
            //
            //    // Skip any files outside of your project's `src` directory
            //    include: [
            //        path.resolve(__dirname, "src"),
            //    ],
            //
            //    // Only run `.js` and `.jsx` files through Babel
            //    test: /\.jsx?$/,
            //
            //    // Options to configure babel with
            //    query: {
            //        plugins: ['transform-runtime'],
            //        presets: ['es2015', 'stage-0', 'react'],
            //    }
            //},
            {test: /\.js$/, loader: "babel-loader", query: {plugins: [],presets: ['es2015', 'stage-0', 'react']}}, /*es6 to es5*/
            {test: /\.jsx$/, loader: "babel-loader", query: {plugins: [],presets: ['es2015', 'stage-0', 'react']}}, /*jsx to js,es5 to es6*/
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},  //loader: "style!css" /*css to css*/
            {test: /\.(jpg|png|otf)$/, loader: "url?limit=8192"}, /*images 打包*/
            {test: /\.scss$/, loader: "style!css!sass"}                     /*sass to css*/
        ],
        //devtool: 'source-map'
    },
    devtool: false, //'inline-source-map',
    debug: false,
    // 声明一个外部依赖, 使用公用 CDN 服务
    //  HTML 代码里需要加上一行
    // <script src="//apps.bdimg.com/libs/moment/2.8.3/moment-with-locales.min.js"></script>
    externals: {
        $: true
    },
    // making sure that Babel isn’t applied to your entire node_modules directory
    exclude: [
        path.resolve(__dirname, "node_modules"),
    ]

    //module: {
    //    loaders: [{
    //        test: /\.js$/,
    //        loader: 'babel-loader'
    //    }, {
    //        test: /\.jsx$/,
    //        loader: 'babel-loader!jsx-loader?harmony'
    //    }]
    //}
}
