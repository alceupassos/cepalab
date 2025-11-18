"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/define-lazy-prop";
exports.ids = ["vendor-chunks/define-lazy-prop"];
exports.modules = {

/***/ "(rsc)/./node_modules/define-lazy-prop/index.js":
/*!************************************************!*\
  !*** ./node_modules/define-lazy-prop/index.js ***!
  \************************************************/
/***/ ((module) => {

eval("\nmodule.exports = (object, propertyName, fn) => {\n\tconst define = value => Object.defineProperty(object, propertyName, {value, enumerable: true, writable: true});\n\n\tObject.defineProperty(object, propertyName, {\n\t\tconfigurable: true,\n\t\tenumerable: true,\n\t\tget() {\n\t\t\tconst result = fn();\n\t\t\tdefine(result);\n\t\t\treturn result;\n\t\t},\n\t\tset(value) {\n\t\t\tdefine(value);\n\t\t}\n\t});\n\n\treturn object;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZGVmaW5lLWxhenktcHJvcC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiO0FBQ0Esc0VBQXNFLHdDQUF3Qzs7QUFFOUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2VwYWxhYi8uL25vZGVfbW9kdWxlcy9kZWZpbmUtbGF6eS1wcm9wL2luZGV4LmpzP2EyMjUiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSAob2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGZuKSA9PiB7XG5cdGNvbnN0IGRlZmluZSA9IHZhbHVlID0+IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5TmFtZSwge3ZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZX0pO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5TmFtZSwge1xuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldCgpIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGZuKCk7XG5cdFx0XHRkZWZpbmUocmVzdWx0KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSxcblx0XHRzZXQodmFsdWUpIHtcblx0XHRcdGRlZmluZSh2YWx1ZSk7XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gb2JqZWN0O1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/define-lazy-prop/index.js\n");

/***/ })

};
;