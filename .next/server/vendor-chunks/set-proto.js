"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/set-proto";
exports.ids = ["vendor-chunks/set-proto"];
exports.modules = {

/***/ "(rsc)/./node_modules/set-proto/Object.setPrototypeOf.js":
/*!*********************************************************!*\
  !*** ./node_modules/set-proto/Object.setPrototypeOf.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar $Object = __webpack_require__(/*! es-object-atoms */ \"(rsc)/./node_modules/es-object-atoms/index.js\");\n\n/** @type {import('./Object.setPrototypeOf')} */\nmodule.exports = $Object.setPrototypeOf || null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc2V0LXByb3RvL09iamVjdC5zZXRQcm90b3R5cGVPZi5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixjQUFjLG1CQUFPLENBQUMsc0VBQWlCOztBQUV2QyxXQUFXLG1DQUFtQztBQUM5QyIsInNvdXJjZXMiOlsid2VicGFjazovL2NlcGFsYWIvLi9ub2RlX21vZHVsZXMvc2V0LXByb3RvL09iamVjdC5zZXRQcm90b3R5cGVPZi5qcz8wNGNkIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyICRPYmplY3QgPSByZXF1aXJlKCdlcy1vYmplY3QtYXRvbXMnKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vT2JqZWN0LnNldFByb3RvdHlwZU9mJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9ICRPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgbnVsbDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/set-proto/Object.setPrototypeOf.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/set-proto/Reflect.setPrototypeOf.js":
/*!**********************************************************!*\
  !*** ./node_modules/set-proto/Reflect.setPrototypeOf.js ***!
  \**********************************************************/
/***/ ((module) => {

eval("\n\n/** @type {import('./Reflect.setPrototypeOf')} */\nmodule.exports = (typeof Reflect !== 'undefined' && Reflect.setPrototypeOf) || null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc2V0LXByb3RvL1JlZmxlY3Quc2V0UHJvdG90eXBlT2YuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsV0FBVyxvQ0FBb0M7QUFDL0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZXBhbGFiLy4vbm9kZV9tb2R1bGVzL3NldC1wcm90by9SZWZsZWN0LnNldFByb3RvdHlwZU9mLmpzPzg3NTAiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9SZWZsZWN0LnNldFByb3RvdHlwZU9mJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9ICh0eXBlb2YgUmVmbGVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgUmVmbGVjdC5zZXRQcm90b3R5cGVPZikgfHwgbnVsbDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/set-proto/Reflect.setPrototypeOf.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/set-proto/index.js":
/*!*****************************************!*\
  !*** ./node_modules/set-proto/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar reflectSetProto = __webpack_require__(/*! ./Reflect.setPrototypeOf */ \"(rsc)/./node_modules/set-proto/Reflect.setPrototypeOf.js\");\nvar originalSetProto = __webpack_require__(/*! ./Object.setPrototypeOf */ \"(rsc)/./node_modules/set-proto/Object.setPrototypeOf.js\");\n\nvar setDunderProto = __webpack_require__(/*! dunder-proto/set */ \"(rsc)/./node_modules/dunder-proto/set.js\");\n\nvar $TypeError = __webpack_require__(/*! es-errors/type */ \"(rsc)/./node_modules/es-errors/type.js\");\n\n/** @type {import('.')} */\nmodule.exports = reflectSetProto\n\t? function setProto(O, proto) {\n\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\tif (reflectSetProto(O, proto)) {\n\t\t\treturn O;\n\t\t}\n\t\tthrow new $TypeError('Reflect.setPrototypeOf: failed to set [[Prototype]]');\n\t}\n\t: originalSetProto || (\n\t\tsetDunderProto ? function setProto(O, proto) {\n\t\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\t\tsetDunderProto(O, proto);\n\t\t\treturn O;\n\t\t} : null\n\t);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc2V0LXByb3RvL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLHNCQUFzQixtQkFBTyxDQUFDLDBGQUEwQjtBQUN4RCx1QkFBdUIsbUJBQU8sQ0FBQyx3RkFBeUI7O0FBRXhELHFCQUFxQixtQkFBTyxDQUFDLGtFQUFrQjs7QUFFL0MsaUJBQWlCLG1CQUFPLENBQUMsOERBQWdCOztBQUV6QyxXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZXBhbGFiLy4vbm9kZV9tb2R1bGVzL3NldC1wcm90by9pbmRleC5qcz82MDFhIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHJlZmxlY3RTZXRQcm90byA9IHJlcXVpcmUoJy4vUmVmbGVjdC5zZXRQcm90b3R5cGVPZicpO1xudmFyIG9yaWdpbmFsU2V0UHJvdG8gPSByZXF1aXJlKCcuL09iamVjdC5zZXRQcm90b3R5cGVPZicpO1xuXG52YXIgc2V0RHVuZGVyUHJvdG8gPSByZXF1aXJlKCdkdW5kZXItcHJvdG8vc2V0Jyk7XG5cbnZhciAkVHlwZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3R5cGUnKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gcmVmbGVjdFNldFByb3RvXG5cdD8gZnVuY3Rpb24gc2V0UHJvdG8oTywgcHJvdG8pIHtcblx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRTIGNhbid0IG5hcnJvdyBpbnNpZGUgYSBjbG9zdXJlLCBmb3Igc29tZSByZWFzb25cblx0XHRpZiAocmVmbGVjdFNldFByb3RvKE8sIHByb3RvKSkge1xuXHRcdFx0cmV0dXJuIE87XG5cdFx0fVxuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdSZWZsZWN0LnNldFByb3RvdHlwZU9mOiBmYWlsZWQgdG8gc2V0IFtbUHJvdG90eXBlXV0nKTtcblx0fVxuXHQ6IG9yaWdpbmFsU2V0UHJvdG8gfHwgKFxuXHRcdHNldER1bmRlclByb3RvID8gZnVuY3Rpb24gc2V0UHJvdG8oTywgcHJvdG8pIHtcblx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgY2FuJ3QgbmFycm93IGluc2lkZSBhIGNsb3N1cmUsIGZvciBzb21lIHJlYXNvblxuXHRcdFx0c2V0RHVuZGVyUHJvdG8oTywgcHJvdG8pO1xuXHRcdFx0cmV0dXJuIE87XG5cdFx0fSA6IG51bGxcblx0KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/set-proto/index.js\n");

/***/ })

};
;