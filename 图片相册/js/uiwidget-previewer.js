/**
 * previewer图片预览组件
 * @author kuanglingxuan@chinaduo.com
 */
;(function($){
	$.uiwidget = $.uiwidget || {};
	$.uiwidget.Previewer = function(target, cfg){
		$.extend(this, cfg);
		this.target = target;
		this.init();
	};
	$.uiwidget.Previewer.prototype = {
		status : 'stop',//play,pause,stop
		loaderSrc : 'images/loader.gif',
		overflowCursor: '',//图片浏览完后的箭头处理，revert:箭头调转，gray:箭头灰色
		containerHeight : 600,
		containerWidth : 800,
		data : [],//使用者传入data数组
		index : 0,//data数据数组下标
		period : 2000,//play每张图片的间隔时间
		step : 0,//旋转步骤
		fadeSpeed : 0,//淡出淡入的速度毫秒
		suitableHeigth : false,//true容器适应图片高度，false图片适应容器高度
		onChangeImage : function(){},
		onLoadError : function(){},
		init : function(){
			var t = this;
			t.target.addClass('previewer-container');
			t.target.css({
				position : 'relative',
				overflow : 'hidden',
				height : t.containerHeight,
				width : t.containerWidth
			});
			t.target.append('<div class="previewer-box" style="position:absolute;z-index:1;"><img class="previewer-image" style="display:none"/><img class="previewer-image-preload" style="display:none"/></div>');
			t.target.append('<img class="previewer-loader" src="'+t.loaderSrc+'" style="position:absolute;z-index:100;"/>');	
			t.target.append('<a href="javascript:void(0)"  hidefocus="true" class="previewer-pre" title="上一张"></a>');
			t.target.append('<a href="javascript:void(0)"  hidefocus="true" class="previewer-next" title="下一张"></a>');	
			
			t.imgEl = t.getImgEl();
			t.getLoaderEl().css({//图片定位在容器中间显示
	            top: ((t.containerHeight - t.loaderEl.height()) / 2),
	            left: ((t.containerWidth - t.loaderEl.width()) / 2)
	        });
			t.imgEl.bind('load', t, t.afterRender);//图片加载完执行
			t.imgEl.bind('error', t, t.afterLoad);//图片加载失败执行
			if(t.data.length > 0 && t.onChangeImage)
				t.onChangeImage(t, t.getIndexValue(t.data, t.index), t.index);
			
			t.getNextEl().bind('click', t, t.onNext);
			t.getPreEl().bind('click', t, t.onPre);
			
			//播放、暂停、停止事件
			if (t.play) {
				t.play.click(function(){
					t.interval = setInterval(function(){
						t.onChangeImage(t, t.getIndexValue(t.data, t.index+1), t.index)
					}, t.period);
					t.status = 'play';
				});
			}
			if (t.pause) {
				t.pause.click(function(){
					clearInterval(t.interval);
					t.status = 'pause';
				});
			}
			if (t.stop) {
				t.stop.click(function(){
					clearInterval(t.interval);
					t.status = 'stop';
					t.index = 0;
					t.onChangeImage(t, t.getIndexValue(t.data, t.index), t.index)
				});
			}
			//图片旋转事件
			if(t.leftRotate){
				t.leftRotate.click(function(){
					t.rotateImage('left');
				});
			}
			if(t.rightRotate){
				t.rightRotate.click(function(){
					t.rotateImage('right');
				});
			}
		},
		beforeRender : function(e){
			this.getLoaderEl().show();
		},
		afterRender : function(e){	
			var t = e.data;
			t.getLoaderEl().hide();
			t.alignCenter();
			t.imgEl.fadeIn(t.fadeSpeed);
			t.step = 0;//旋转复位0
			t.iW = t.imgEl.width();//保存原始尺寸，为了t.suitableImage(t.iW, t.iH)
			t.iH = t.imgEl.height();
			if(t.suitableHeigth){//是否让容器适应图片高度
				t.containerHeight = t.imgEl.height();
			}
			t.target.css({
				height : t.containerHeight
			});
			//容器尺寸小于图片尺寸就自动适应
			if(t.containerWidth < t.iW || t.containerHeight < t.iH)
				t.suitableImage(t.iW, t.iH);
			if(t.onAfterRender)
				t.onAfterRender(t);
		},
		afterLoad : function(e){
			var t = e.data;
			t.getLoaderEl().hide();
			t.onLoadError(t, t.getIndexValue(t.data, t.index), t.index);
		},
		onNext : function(e){
			var t = this;
			if(e && e.data)
			 	t= e.data; 
			t.onChangeImage(t, t.getIndexValue(t.data, t.index+1), t.index);
	    },
		onPre : function(e){
			var t = this;
			if(e && e.data)
			 	t= e.data; 
			t.onChangeImage(t, t.getIndexValue(t.data, t.index-1), t.index);
	    },
		goTo : function(index){
			var t = this;
			t.onChangeImage(t, t.getIndexValue(t.data, index), t.index);
		},
		hasNext : function(){
			var t = this;
			if(t.index >= t.data.length-1){
				return false;
			}
			return true;
		},
		hasPre : function(){
			var t = this;
			if(t.index <= 0){
				return false;
			}
			return true;
		},
		/**
		 * 放出图片渲染方法给使用者调用
		 * @param {Object} src
		 */
	    renderImage : function(src){//多张图片切换
	    	var t = this;
			
			if ($.browser.msie) {
				t.imgEl[0].style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0)';
				if (t.containerWidth < t.iW || t.containerHeight < t.iH) {
					t.suitableImage(t.iW, t.iH);//因为ie在fadeOut的时候瞬间会去掉filter，而图片会复原位置就错位，需要重新赋值原始尺寸
				}
			}
			if(t.canvasEl){
				t.canvasEl.fadeOut(t.fadeSpeed, function(){t.fadeOutCallBack(src);});
			}else{
				t.imgEl.fadeOut(t.fadeSpeed, function(){t.fadeOutCallBack(src);});
			}
			if(t.overflowCursor == 'revert'){
				if(t.index <= 0){
					t.getPreEl().width('0%');
					t.getNextEl().width('100%');
				}else if(t.index >= t.data.length-1){
					t.getPreEl().width('100%');
					t.getNextEl().width('0%');
				}else{
					t.getPreEl().width('50%');
					t.getNextEl().width('50%');
				}
			}else if(t.overflowCursor == 'gray'){
				if(t.index <= 0){
					t.getPreEl().addClass('previewer-pre-dis');
				}else{
					t.getPreEl().attr('className', 'previewer-pre');
				}
				if(t.index >= t.data.length-1){
					t.getNextEl().addClass('previewer-next-dis');
				}else{
					t.getNextEl().attr('className', 'previewer-next');
				}
				
			}
	    },
		/**
		 * fadeOut后的回调，处理图片src的改变
		 * @param {Object} src
		 */
		fadeOutCallBack : function(src){
			var t = this;
			t.beforeRender();
			//恢复原始尺寸
			t.imgEl.width('');
			t.imgEl.height('');
			t.imgEl.attr('src',src);
		},
		/**
		 * 图片旋转
		 * @param {Object} direction 旋转方向 right left
		 */
		rotateImage : function(direction){
	    	var t = this;
			var img = t.imgEl;
			var step = t.step;
			if(direction=='right'){
				(step==3)? step=0:step++;
			}else if(direction=='left'){
				(step==0)? step=3:step--;
			}
			t.step = step;
			//每转动都恢复原始尺寸，再重新计算合适尺寸
            t.imgEl.width('');
			t.imgEl.height('');
			if($.browser.msie){
				img[0].style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ step +')';
				var w, h, flag;//设置flag标志，因为用filter之后高和宽已经颠倒，详见suitableImage方法
				w = t.imgEl.width();
	            h = t.imgEl.height();
	            if (step == 0 || step == 2) {
	                flag = false;
	            }else if (step == 1 || step == 3) {
	                flag = true;
	            }
				if(t.containerWidth < w || t.containerHeight < h)
					t.suitableImage(w, h, flag);
				t.alignCenter();
			}else{
				img.hide();
				if(!t.canvasEl){
					t.getBoxEl().append('<canvas></canvas>');
				}
				var c = t.getCanvasEl();
				c.show();
				var ctx = c[0].getContext('2d');
				
				var w, h;
				if (step == 0 || step == 2) {
	                w = t.imgEl.width();
	            	h = t.imgEl.height();
	            }else if (step == 1 || step == 3) {
	                w = t.imgEl.height();
	            	h = t.imgEl.width();
	            }
				//canvas尺寸用suitableImage计算出图片尺寸得到
				var flag;//判断是否调用过suitableImage，因为尺寸小于容器的图片不会它
				if(t.containerWidth < w || t.containerHeight < h){
					t.suitableImage(w, h);
					flag = true;
				}
				w = t.imgEl.width();
	            h = t.imgEl.height();
			//	alert(w);alert(h);
				//赋给canvas
				c.attr('width', w);
				c.attr('height', h);
				if (step == 1 || step == 3) {//当竖向时颠倒高和宽，以便drawImage使用
					if (flag) {
						var temp = w;
						w = h;
						h = temp;
					}else{//如果是小于容器图片就颠倒宽高
						c.attr('width', h);
						c.attr('height', w);
					}
				}
			//	alert(w);alert(h);
				var radian = Math.PI / 180;//弧度
				switch(step) {
				default :
				case 0 :
					ctx.rotate(0 * radian);
					ctx.drawImage(img[0], 0, 0, w, h);
					break;
				case 1 :
					ctx.rotate(90 * radian);
					ctx.drawImage(img[0], 0, -h, w, h);
					break;
				case 2 :
					ctx.rotate(180 * radian);
					ctx.drawImage(img[0], -w, -h, w, h);
					break;
				case 3 :
					ctx.rotate(270 * radian);
					ctx.drawImage(img[0], -w, 0, w, h);
					break;
				}
			}
	    },
		/**
		 * 图片尺寸合适容器的尺寸
		 * @param {Object} iW 图片宽
		 * @param {Object} iH 图片高
		 * @param {Object} flag 因为用filter之后高和宽已经颠倒
		 */
		suitableImage : function(iW, iH, flag){
	    	var t = this;	
			var cW = t.containerWidth;
			var cH = t.containerHeight;
			if(!iW)iW = t.imgEl.width();
			if(!iH)iH = t.imgEl.height();
			var w = iW/cW;
	        var h = iH/cH;
	  		if(w > h){
	  			var zoom = cW / iW;
				if(flag){
					w = iH * zoom;
					h = cW;
				}else{
					w = cW;
					h = iH * zoom;
				}
	  			t.imgEl.css({
	  				width : w,
	  				height : h
		        });
	  	  	}else{
	  	  		var zoom = cH / iH;
				if(flag){
					w = cH;
					h = iW * zoom;
				}else{
					w = iW * zoom;
					h = cH;
				}
	  	  		t.imgEl.css({
	  	  			width : w,
					height : h
		        });
	  	  	}
			t.alignCenter();
		},
		remove : function(index){
			var t = this;
	    	t.data.splice(index, 1);
			if(index < t.data.length){
				t.goTo(index);
			}else{
				t.goTo(t.data.length - 1);
			}
			
	    },
		/**
		 * 上居中
		 */
		alignCenter : function(){
			var t = this;
	    	t.getBoxEl().css({
	            top: ((t.containerHeight - t.imgEl.height()) / 2),
	            left: ((t.containerWidth - t.imgEl.width()) / 2)
	        });
	    },
		/**
		 * 得到数组相应下标元素
		 * @param {Object} obj 数组
		 * @param {Object} index 下标
		 */
		getIndexValue : function(obj, index){
	    	if(index < 0 ||index >= obj.length){
				if(this.interval){//播放完停止定时器
					clearInterval(this.interval);
				}
				if(index < 0) return 'first';
				if(index >= obj.length) return 'end';
			}
			this.index = index;
			return obj[index];
	    },
		/**
		 * 预加载图片
		 * @param {Object} src 图片地址
		 */
		preloadImage : function(src){
	    	var t = this;
			t.getImgPreloadEl().attr('src', src);
	    },
		getLoaderEl : function(){
			return this.loaderEl || (this.loaderEl = this.target.find('.previewer-loader'));
		},
		getImgEl : function(){
			return this.imgEl || (this.imgEl = this.target.find('.previewer-image'));
		},
		getNextEl : function(){
			return this.nextEl || (this.nextEl = this.target.find('.previewer-next'));
		},
		getPreEl : function(){
			return this.preEl || (this.preEl = this.target.find('.previewer-pre'));
		},
		getBoxEl : function(){
			return this.boxEl || (this.boxEl = this.target.find('.previewer-box'));
		},
		getCanvasEl : function(){
			return this.canvasEl || (this.canvasEl = this.target.find('canvas'));
		},
		getImgPreloadEl : function(){
			return this.imgPreloadEl || (this.imgPreloadEl = this.target.find('.previewer-image-preload'));
		}
	};
	
	$.fn.previewer = function(cfg){
		return new $.uiwidget.Previewer(this, cfg);
	};
})(jQuery);