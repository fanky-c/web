function lottery(obj,opts,callBack){
	this.opts=$.extend({
	     fillStyle:'#bdbdbd',
		 showTxt:'恭喜您'
		},opts||{});
				
    this.canvas=document.querySelector(obj);
	this.canvas.ctx=this.canvas.getContext('2d');
    this.canvas.ctx.fillStyle=this.opts.fillStyle;
	this.canvas.ctx.fillRect(0,0,$(this.canvas).width(),$(this.canvas).height());    
	this.canvas.ctx.globalCompositeOperation='destination-out';
	this.winInfo=document.querySelector('#winInfo');
	this.winInfo.style.display='block';
	this.winInfo.innerHTML=this.opts.showTxt;
	this.callBack=callBack;
	this.init();
	
}

lottery.prototype={
	init:function(){	 		
		 this.scratch();
		},
	
	scratch:function(){
		var c=this;  
		this.canvas.isDrawing=false;

		this.canvas.scrStart=function(e){  //移动开始
			this.isDrawing=true; 
			if(!this.sx){
				if(e.changedTouches){
					this.sx=e.changedTouches[0].pageX-this.getPos(this).left;
				}
				else{
					this.sx=e.pageX-this.getPos(this).left;
				}
			}
		};
		
		this.canvas.scrEnd=function(e){  //移动结束
			this.isDrawing=false;
		};
		
		this.canvas.scrMove=function(e){   //移动中
			if(!this.isDrawing) return;
			
			if(e.changedTouches){
				var x=e.changedTouches[0].pageX-this.getPos(this).left;
				var y=e.changedTouches[0].pageY-this.getPos(this).top;
			}
			else{
				var x=e.pageX-this.getPos(this).left;
				var y=e.pageY-this.getPos(this).top;
			}
			document.title=this.sx+'...'+x;
			if(Math.abs(this.sx-x)>100){	
				c.callBack.apply(this);
				this.removeEventListener('touchstart',this.scrStart,false);
				this.removeEventListener('touchend',this.scrEnd,false);
				this.removeEventListener('touchmove',this.scrMove,false);
				this.removeEventListener('mousedown',this.scrStart,false);
				this.removeEventListener('mouseup',this.scrEnd,false);
				this.removeEventListener('mousemove',this.scrMove,false);
			}
			
			this.ctx.arc(x,y,30,0,2*Math.PI);
			this.ctx.fillStyle='rgba(255,255,255,1)';
			this.ctx.fill();

			e.preventDefault();
		};
		
		this.canvas.getPos=function(obj){  //获取obj离浏览器的距离
			var l=0,t=0;
			
			while(obj){
				l+=obj.offsetLeft;
				t+=obj.offsetTop;
				obj=obj.offsetParent;
			}
			
			return {top:t,left:l};
		}
		
		this.canvas.addEventListener('touchstart',this.canvas.scrStart,false);
		this.canvas.addEventListener('touchend',this.canvas.scrEnd,false);
		this.canvas.addEventListener('touchmove',this.canvas.scrMove,false);
		this.canvas.addEventListener('mousedown',this.canvas.scrStart,false);
		this.canvas.addEventListener('mouseup',this.canvas.scrEnd,false);
		this.canvas.addEventListener('mousemove',this.canvas.scrMove,false);
	}
	
}


	







