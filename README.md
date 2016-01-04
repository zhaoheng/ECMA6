# ECMA6
ECMA6,——personal use cases, to help you understand the use of ECMA6。

Here are the steps to compile ECMA5 into gulp：

npm install --save-dev gulp-babel

npm install babel-preset-es2015

package.json add:

"babel": {
    "ignore": [
    ],
    "presets": ["es2015"]
}
