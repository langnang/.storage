"use strict";
(function (define) {
  define(function (require, exports, module) {
    module.exports = {
      template: require("text!./../../../../views/static/component/progress/index.hbs"),
      run: function ({render, route}) {
        console.log(route);
        render({...route});
      },
    };
  });
})(define);
