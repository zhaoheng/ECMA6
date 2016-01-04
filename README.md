# ECMA6
ECMA6,——personal use cases, to help you understand the use of ECMA6。


Here are the steps to compile ECMA5 into gulp：

  1. npm install --save-dev gulp-babel
  
  2. npm install babel-preset-es2015
  
  3. package.json add:
  
        "babel": {
            "ignore": [
            ],
            "presets": ["es2015"]
        }

Here are second ways, using pure Babel method:
  
  1. npm install --save-dev babel-cli babel-preset-es2015 babel-preset-stage-0
     (For Browserify workflows, you may need these, as well:  npm install --save-dev babelify browserify )

  2. babel script.js --out-file script-compiled.js
     (babel -d build-dir source-dir)
     (browserify script.js -t babelify --outfile bundle.js)
