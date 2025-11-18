"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-string";
exports.ids = ["vendor-chunks/is-string"];
exports.modules = {

/***/ "(rsc)/./node_modules/is-string/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-string/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar callBound = __webpack_require__(/*! call-bound */ \"(rsc)/./node_modules/call-bound/index.js\");\n\n/** @type {(receiver: ThisParameterType<typeof String.prototype.valueOf>, ...args: Parameters<typeof String.prototype.valueOf>) => ReturnType<typeof String.prototype.valueOf>} */\nvar $strValueOf = callBound('String.prototype.valueOf');\n\n/** @type {import('.')} */\nvar tryStringObject = function tryStringObject(value) {\n\ttry {\n\t\t$strValueOf(value);\n\t\treturn true;\n\t} catch (e) {\n\t\treturn false;\n\t}\n};\n/** @type {(receiver: ThisParameterType<typeof Object.prototype.toString>, ...args: Parameters<typeof Object.prototype.toString>) => ReturnType<typeof Object.prototype.toString>} */\nvar $toString = callBound('Object.prototype.toString');\nvar strClass = '[object String]';\nvar hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ \"(rsc)/./node_modules/has-tostringtag/shams.js\")();\n\n/** @type {import('.')} */\nmodule.exports = function isString(value) {\n\tif (typeof value === 'string') {\n\t\treturn true;\n\t}\n\tif (!value || typeof value !== 'object') {\n\t\treturn false;\n\t}\n\treturn hasToStringTag ? tryStringObject(value) : $toString(value) === strClass;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvaXMtc3RyaW5nL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLGdCQUFnQixtQkFBTyxDQUFDLDREQUFZOztBQUVwQyxXQUFXLHFLQUFxSztBQUNoTDs7QUFFQSxXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsV0FBVyx3S0FBd0s7QUFDbkw7QUFDQTtBQUNBLHFCQUFxQixtQkFBTyxDQUFDLDRFQUF1Qjs7QUFFcEQsV0FBVyxhQUFhO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NlcGFsYWIvLi9ub2RlX21vZHVsZXMvaXMtc3RyaW5nL2luZGV4LmpzPzM0MmUiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEJvdW5kID0gcmVxdWlyZSgnY2FsbC1ib3VuZCcpO1xuXG4vKiogQHR5cGUgeyhyZWNlaXZlcjogVGhpc1BhcmFtZXRlclR5cGU8dHlwZW9mIFN0cmluZy5wcm90b3R5cGUudmFsdWVPZj4sIC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIFN0cmluZy5wcm90b3R5cGUudmFsdWVPZj4pID0+IFJldHVyblR5cGU8dHlwZW9mIFN0cmluZy5wcm90b3R5cGUudmFsdWVPZj59ICovXG52YXIgJHN0clZhbHVlT2YgPSBjYWxsQm91bmQoJ1N0cmluZy5wcm90b3R5cGUudmFsdWVPZicpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xudmFyIHRyeVN0cmluZ09iamVjdCA9IGZ1bmN0aW9uIHRyeVN0cmluZ09iamVjdCh2YWx1ZSkge1xuXHR0cnkge1xuXHRcdCRzdHJWYWx1ZU9mKHZhbHVlKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcbi8qKiBAdHlwZSB7KHJlY2VpdmVyOiBUaGlzUGFyYW1ldGVyVHlwZTx0eXBlb2YgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZz4sIC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc+KSA9PiBSZXR1cm5UeXBlPHR5cGVvZiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nPn0gKi9cbnZhciAkdG9TdHJpbmcgPSBjYWxsQm91bmQoJ09iamVjdC5wcm90b3R5cGUudG9TdHJpbmcnKTtcbnZhciBzdHJDbGFzcyA9ICdbb2JqZWN0IFN0cmluZ10nO1xudmFyIGhhc1RvU3RyaW5nVGFnID0gcmVxdWlyZSgnaGFzLXRvc3RyaW5ndGFnL3NoYW1zJykoKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuIGhhc1RvU3RyaW5nVGFnID8gdHJ5U3RyaW5nT2JqZWN0KHZhbHVlKSA6ICR0b1N0cmluZyh2YWx1ZSkgPT09IHN0ckNsYXNzO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/is-string/index.js\n");

/***/ })

};
;