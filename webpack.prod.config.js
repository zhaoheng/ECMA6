var webpack = require('webpack')
var path = require('path')

var plugins = [
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
		"window.jQuery": "jquery"
	}),
	new webpack.ProvidePlugin({
		"_": "underscore"
	}),
	new webpack.optimize.CommonsChunkPlugin({
		filename: "vendor.build.js",
		name: "vendor",
		minChunks: Infinity
	}),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}),
	new webpack.optimize.MinChunkSizePlugin({
		compress: {
			warnings: false
		}
	})
];

module.exports = {
	entry: {
		vendor: ["jquery","vue","vue-router"],
		app: './promo/src/app.js'
    },
	output: {
		path: './promo/dist',
		publicPath: 'promo/dist/',
		filename: "[name].build.js"
	},
	module:{
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'file?name=[name].[ext]?[hash]'
			},
			{// 如果要加载jQuery插件,解析路径&参数  
				test : "/lib/jquery/*.js$",  
				loader : "'imports?jQuery=jquery,$=jquery,this=>window"  
			} 
		]
	},
	babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
	plugins: plugins,
}
