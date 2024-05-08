"use strict";System.register(["app/plugins/sdk","./libs/echarts.min","./style.css!"],function(a,b){function c(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function d(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!b||"object"!=typeof b&&"function"!=typeof b?a:b}function e(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var f,g,h,i;return{setters:[function(a){f=a.MetricsPanelCtrl},function(a){g=a["default"]},function(a){}],execute:function(){h=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),a("Controller",i=function(a){function b($scope,$injector){c(this,b);var a=d(this,(b.__proto__||Object.getPrototypeOf(b)).call(this,$scope,$injector)),e={IS_UCD:!1,url:"",method:"POST",upInterval:6e4,format:"Year",ChartOption:{}};return console.log(_),_.defaults(a.panel,e),a.events.on("data-received",a.onDataReceived.bind(a)),a.events.on("data-error",a.onDataError.bind(a)),a.events.on("data-snapshot-load",a.onDataReceived.bind(a)),a.events.on("init-edit-mode",a.onInitEditMode.bind(a)),a.events.on("panel-initialized",a.render.bind(a)),a.refreshData(),a}return e(b,a),h(b,[{key:"onDataReceived",value:function(a){this.refreshed=!0,this.render(),this.refreshed=!1}},{key:"onDataError",value:function(a){this.render()}},{key:"onInitEditMode",value:function(){this.addEditorTab("Option","public/plugins/empty-panel/partials/options.html",2),this.addEditorTab("Docs","public/plugins/empty-panel/partials/docs.html",3)}},{key:"refreshData",value:function(){var a=this,b=this,c=void 0;c=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");c.onreadystatechange=function(){4==c.readyState&&200==c.status&&(b.customizeData=JSON.parse(c.responseText),b.onDataReceived())},this.panel.IS_UCD?(c.open(b.panel.method,b.panel.url,!0),c.send()):c=null,this.$timeout(function(){a.refreshData()},b.panel.upInterval)}},{key:"link",value:function(a,b,c,d){function e(){var a=d.height||panel.height||d.row.height;_.isString(a)&&(a=parseInt(a.replace("px",""),10)),a+=0,h.style.height=a+"px"}function f(){if(i&&(e(),i.resize(),d.refreshed)){i.clear();d.panel.ChartOption;i.setOption({xAxis:{type:"category",data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]},yAxis:{type:"value"},series:[{data:[820,932,901,934,1290,1330,1320],type:"line"}]})}}var h=b.find(".echarts_container")[0];d.refreshed=!0,e();var i=g.init(h,"dark");setTimeout(function(){i.resize()},1e3),this.events.on("render",function(){f(),d.renderingCompleted()})}}]),b}(f)),a("Controller",i),i.templateUrl="partials/module.html"}}});
//# sourceMappingURL=controller.js.map