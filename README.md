# ECMA6
ECMA6,——personal use cases, to help you understand the use of ECMA6。

Here are the steps to compile ECMA5 into gulp：

    1.npm install --save-dev gulp-babel
    
    2.npm install babel-preset-es2015
    
    3.package.json add:
    
        "babel": {
            "ignore": [
            ],
            "presets": ["es2015"]
        }
