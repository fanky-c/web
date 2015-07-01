/**
 * imagefall图片瀑布流组件
 * @author kuanglingxuan@chinaduo.com
 */
;(function($){
	$.uiwidget = $.uiwidget || {};
	$.uiwidget.Imagefall = function(target, cfg){
		$.extend(this, cfg);
		this.target = target;
		this.init();
	};
	$.uiwidget.Imagefall.prototype = {
		imageWidth : 80,
		columnSize : 4,
		data : [],//使用者传入data数组
		attachment : [],//data的绑定附件
		fadeSpeed : 1000,//淡出淡入的速度毫秒
		defaultImage : "",
		init : function(){
			var t = this;
			t.target.addClass('imagefall-container');
			t.render();
		},
		render : function(){
			console.log('render');
			var t = this;
			var html = '<div class="content"><ul class="row">';
			for(var i = 0;i < t.columnSize;i++){
				html += '<li class="columns"><ul></ul></li>';
			} 
			html += '</ul></div>';
			t.target.html(html);											
			t.renderItem(0);										
		},
		renderItem : function(s){
			var t = this;
			for(var i = s;i < t.data.length;i++){
				var html = t.onEachData(i, t.data[i]);
				$(t.getColumnsEl()[i%t.columnSize]).append(html).find('img').fadeIn(t.fadeSpeed).load(function(){
					t.successLoad();
				}).error(function(){
					t.errorLoad();
				});
			}
		},
		onEachData : function(i, n){//遍历data数组，自定义请重写
			var t = this;
			var html = '<li class="item">'
				+'<div class="img">'
				+'<img style="display:none;" src="'+n.url+'" width="223" title="demo1">'
				+'</div>'
				+'<div class="item-mask">'
				+'<a href="javascript:void(0);"></a>'
				+'</div>'
				+'<ul class="bottom">'
				+'<li class="girl-info">'
				+'<p class="name">龚叶轩</p>'
				+'<p class="age"><span>16</span>岁</p>'
				+'</li>'
				+'<li class="like-num">'
				+'<i></i>367556'
				+'</li>'
				+'</ul>'
				+'</li>';
			return html;


		},
		addData : function(d){
			var t = this;
			var s = t.data.length;
			$.merge(t.data, d);
			t.renderItem(s);
		},
		successLoad : function(){

		},
		errorLoad : function(){	

		},

		getColumnsEl : function(){
			return this.columnsEl || (this.columnsEl = this.target.find('.columns ul'));
		},
		getItemsEl : function(){
			return this.itemsEl || (this.itemsEl = this.target.find('.item'));
		},
		getImgsEl : function(){
			return this.imgsEl || (this.imgsEl = this.target.find('div.img img'));
		},
	};
	
	$.fn.imagefall = function(cfg){
		return new $.uiwidget.Imagefall(this, cfg);
	};
})(jQuery);