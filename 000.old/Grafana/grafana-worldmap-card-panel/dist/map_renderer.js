"use strict";System.register(["./css/leaflet.css!","./worldmap"],function(a,b){function c(a,b,c,e){function f(){if(e.data){var a=b.find(".mapcontainer");if(!(a[0].id.indexOf("{{")>-1)){e.map||(e.map=new d(e,a[0]),setTimeout(function(){e.map.panToMapCenter()},800),e.panel.isZoomed=!1),e.map.resize(),e.mapCenterMoved&&e.map.panToMapCenter(),!e.map.legend&&e.panel.showLegend&&e.map.createLegend(),e.map.drawCircles();var c=document.getElementsByClassName("side-info-container");if(c.length>0){c=c[0].parentNode;var f=c.offsetHeight;f>=e.height?(c.style.height=e.height+"px",c.classList.add("leaflet-top-right-scroll"),c.style.pointerEvents="auto"):(c.style.height="auto",c.classList.remove("leaflet-top-right-scroll"))}e.map.circles.length>0&&!e.panel.isZoomed&&(g(),e.panel.isZoomed=!0)}}}function g(){e.map.map.on("zoomstart",function(a){0===e.panel.lastZoom&&(e.panel.lastZoom=e.map.map.getZoom())}),e.map.map.on("zoomend",function(a){var b=1;if(e.map.map.getZoom()-e.panel.lastZoom<0&&(e.panel.zoomDelta-=.25,e.panel.lastZoom=e.map.map.getZoom()),e.map.map.getZoom()-e.panel.lastZoom>0&&(e.panel.zoomDelta+=.25,e.panel.lastZoom=e.map.map.getZoom()),e.panel.zoomDelta>=1||e.panel.zoomDelta<=-1){for(var c=0;c<e.map.circles.length;c++){if("string"===e.panel.circleMaxSize&&null===e.panel.circleMaxSize||"string"===e.panel.circleMinSize&&null===e.panel.circleMinSize)var d=e.panel.circleDefaultMaxSize,f=e.panel.circleDefaultMinSize;else var d=e.panel.circleMaxSize,f=e.panel.circleMinSize;e.panel.zoomDelta<=-1&&e.map.circles[c].getRadius()-b>=f?(e.map.circles[c].setRadius(e.map.circles[c].getRadius()-b),e.panel.circleCurrentSize=e.map.circles[c].getRadius()):e.panel.zoomDelta>=1&&e.map.circles[c].getRadius()+b<=d&&(e.map.circles[c].setRadius(e.map.circles[c].getRadius()+b),e.panel.circleCurrentSize=e.map.circles[c].getRadius())}e.panel.zoomDelta=0}})}e.events.on("render",function(){f(),e.renderingCompleted()})}var d;return a("default",c),{setters:[function(a){},function(a){d=a["default"]}],execute:function(){}}});
//# sourceMappingURL=map_renderer.js.map