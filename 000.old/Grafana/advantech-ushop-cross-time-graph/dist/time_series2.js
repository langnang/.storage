"use strict";System.register(["app/core/utils/kbn","./ticks","lodash"],function(a,b){function c(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function d(a,b){if(!a)return!1;if("/"===a[0]){var c=h.stringToJsRegex(a);return null!=b.match(c)}return a===b}function e(a){return 0===a?.001:a/10}function f(a,b){for(var c=0;c<a.length;c++){var d=a[c],e=b.yaxes,f=d.yaxis||1,g=e[f-1],k=i(a,g),l=k.tickDecimals,m=k.scaledDecimals,n=h.valueFormats[b.yaxes[f-1].format];j.isNumber(b.decimals)?d.updateLegendValues(n,b.decimals,null):(l=(l||-1)+1,d.updateLegendValues(n,l,m+2))}}function g(a){var b=null,c=null,d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done);d=!0){var i=g.value;(null===c||c<i.stats.max)&&(c=i.stats.max),(null===b||b>i.stats.min)&&(b=i.stats.min)}}catch(j){e=!0,f=j}finally{try{!d&&h["return"]&&h["return"]()}finally{if(e)throw f}}return{datamin:b,datamax:c}}var h,i,j,k,l;return a("updateLegendValues",f),a("getDataMinMax",g),{setters:[function(a){h=a["default"]},function(a){i=a.getFlotTickDecimals},function(a){j=a["default"]}],execute:function(){k=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),l=function(){function a(b){c(this,a),this.datapoints=b.datapoints,this.label=b.alias,this.id=b.alias,this.alias=b.alias,this.aliasEscaped=j.escape(b.alias),this.color=b.color,this.valueFormater=h.valueFormats.none,this.stats={},this.legend=!0,this.unit=b.unit,this.hasMsResolution=this.isMsResolutionNeeded()}return k(a,[{key:"applySeriesOverrides",value:function(a){this.lines={},this.dashes={dashLength:[]},this.points={},this.bars={},this.yaxis=1,this.zindex=0,this.nullPointMode=null,delete this.stack;for(var b=0;b<a.length;b++){var c=a[b];d(c.alias,this.alias)&&(void 0!==c.lines&&(this.lines.show=c.lines),void 0!==c.dashes&&(this.dashes.show=c.dashes,this.lines.lineWidth=0),void 0!==c.points&&(this.points.show=c.points),void 0!==c.bars&&(this.bars.show=c.bars),void 0!==c.fill&&(this.lines.fill=e(c.fill)),void 0!==c.stack&&(this.stack=c.stack),void 0!==c.linewidth&&(this.lines.lineWidth=this.dashes.show?0:c.linewidth,this.dashes.lineWidth=c.linewidth),void 0!==c.dashLength&&(this.dashes.dashLength[0]=c.dashLength),void 0!==c.spaceLength&&(this.dashes.dashLength[1]=c.spaceLength),void 0!==c.nullPointMode&&(this.nullPointMode=c.nullPointMode),void 0!==c.pointradius&&(this.points.radius=c.pointradius),void 0!==c.steppedLine&&(this.lines.steps=c.steppedLine),void 0!==c.zindex&&(this.zindex=c.zindex),void 0!==c.fillBelowTo&&(this.fillBelowTo=c.fillBelowTo),void 0!==c.color&&(this.color=c.color),void 0!==c.transform&&(this.transform=c.transform),void 0!==c.legend&&(this.legend=c.legend),void 0!==c.yaxis&&(this.yaxis=c.yaxis))}}},{key:"getFlotPairs",value:function(a){var b=[];this.stats.total=0,this.stats.max=-Number.MAX_VALUE,this.stats.min=Number.MAX_VALUE,this.stats.logmin=Number.MAX_VALUE,this.stats.avg=null,this.stats.current=null,this.stats.first=null,this.stats.delta=0,this.stats.diff=null,this.stats.range=null,this.stats.timeStep=Number.MAX_VALUE,this.allIsNull=!0,this.allIsZero=!0;for(var c,d,e,f="connected"===a,g="null as zero"===a,h=0,i=0,k=!0,l=0;l<this.datapoints.length;l++){if(d=this.datapoints[l][0],c=this.datapoints[l][1],void 0!==e){var m=c-e;m<this.stats.timeStep&&(this.stats.timeStep=m)}if(e=c,null===d){if(f)continue;g&&(d=0)}null!==d&&(j.isNumber(d)&&(this.stats.total+=d,this.allIsNull=!1,h++),d>this.stats.max&&(this.stats.max=d),d<this.stats.min&&(this.stats.min=d),null===this.stats.first?this.stats.first=d:i>d?(k=!1,l===this.datapoints.length-1&&(this.stats.delta+=d)):(k?this.stats.delta+=d-i:this.stats.delta+=d,k=!0),i=d,d<this.stats.logmin&&d>0&&(this.stats.logmin=d),0!==d&&(this.allIsZero=!1)),b.push([c,d])}return this.stats.max===-Number.MAX_VALUE&&(this.stats.max=null),this.stats.min===Number.MAX_VALUE&&(this.stats.min=null),b.length&&!this.allIsNull&&(this.stats.avg=this.stats.total/h,this.stats.current=b[b.length-1][1],null===this.stats.current&&b.length>1&&(this.stats.current=b[b.length-2][1])),null!==this.stats.max&&null!==this.stats.min&&(this.stats.range=this.stats.max-this.stats.min),null!==this.stats.current&&null!==this.stats.first&&(this.stats.diff=this.stats.current-this.stats.first),this.stats.count=b.length,b}},{key:"updateLegendValues",value:function(a,b,c){this.valueFormater=a,this.decimals=b,this.scaledDecimals=c}},{key:"formatValue",value:function(a){return j.isFinite(a)||(a=null),this.valueFormater(a,this.decimals,this.scaledDecimals)}},{key:"isMsResolutionNeeded",value:function(){for(var a=0;a<this.datapoints.length;a++)if(null!==this.datapoints[a][1]){var b=this.datapoints[a][1].toString();if(13===b.length&&b%1e3!==0)return!0}return!1}},{key:"hideFromLegend",value:function(a){return!(!a.hideEmpty||!this.allIsNull)||(!this.legend||!(!a.hideZero||!this.allIsZero))}}]),a}(),a("default",l)}}});
//# sourceMappingURL=time_series2.js.map