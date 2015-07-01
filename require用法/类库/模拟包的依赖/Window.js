// JavaScript Document
define(['jquery'],function($){	  
  function Window(){    //模拟window原生态弹窗
	   this.cfg={
		   width:100,
		   height:100,
		   top:100 
		   }
	  };
  
  Window.prototype={
	     alert:function(option){
			  var that=this,
			      layout=$('<div class="zc-layout-c"></div>'),
			      mask=$('<div class="zc-mask-c"></div>'),
			      boundBox=$('<div class="zc-boundBox-c"></div>'),
				  modal_top=$('<div class="zc-modal-header"><button type="button" class="zc-close">×</button><h3>header</h3></div>'),
				  modal_body=$('<div class="zc-modal-body"><p>One fine body…</p></div>'),
				  modal_footer=$('<div class="zc-modal-footer"><a href="javascript::" class="zc-sure-c">确定</a></div>'),				  
				  content=$('<div></div>');
			      
				  $.extend(this.cfg,option||{});  //合并参数
			      
				  boundBox.css({'width':this.cfg.width    //设置样式
				                ,'height':this.cfg.height
								,'position':'fixed'
								,'top':this.cfg.top
								,'left':'50%'
								,'marginLeft':-parseInt(this.cfg.width)/2
								,'border':this.cfg.border
								,'position':'relative'							
								});
				  modal_body.find('p').html(this.cfg.content)     //设置显示内容				
				  
				  layout.append(mask);
				  boundBox.append(modal_top);
				  boundBox.append(modal_body);
				  boundBox.append(modal_footer);
				  layout.append(boundBox);			
			      $('body').append(layout);      //添加到body
				  
				  boundBox.find('.zc-sure-c,.zc-close').on('click',function(){  //点击确定按钮
					    that.cfg.callBack&&that.cfg.callBack.apply(layout);
						layout.remove();					  
					  })

			 },
		 
		 confirm:function(option){
			  var that=this,
			      layout=$('<div class="zc-layout-c"></div>'),
			      mask=$('<div class="zc-mask-c"></div>'),
			      boundBox=$('<div class="zc-boundBox-c"></div>'),
				  modal_top=$('<div class="zc-modal-header"><button type="button" class="zc-close">×</button><h3>header</h3></div>'),
				  modal_body=$('<div class="zc-modal-body"><p>One fine body…</p></div>'),
				  modal_footer=$('<div class="zc-modal-footer"><a href="javascript::" class="zc-sure-c">确定</a><a href="javascript::" class="zc-cancle-c">取消</a></div>'),				  
				  content=$('<div></div>');
			      
				  $.extend(this.cfg,option||{});  //合并参数
			      
				  boundBox.css({'width':this.cfg.width    //设置样式
				                ,'height':this.cfg.height
								,'position':'fixed'
								,'top':this.cfg.top
								,'left':'50%'
								,'marginLeft':-parseInt(this.cfg.width)/2
								,'border':this.cfg.border
								,'position':'relative'							
								});
				  modal_body.find('p').html(this.cfg.content)     //设置显示内容				
				  
				  layout.append(mask);
				  boundBox.append(modal_top);
				  boundBox.append(modal_body);
				  boundBox.append(modal_footer);
				  layout.append(boundBox);			
			      $('body').append(layout);      //添加到body
				  
				  boundBox.find('.zc-sure-c').on('click',function(){  //点击确定按钮
					    that.cfg.callSureBack&&that.cfg.callSureBack.apply(layout);
						layout.remove();					  
					  });
					  
				  boundBox.find('.zc-cancle-c,.zc-close').on('click',function(){  //点击取消按钮
					    that.cfg.callCancleBack&&that.cfg.callCancleBack.apply(layout);
						layout.remove();					  
					  });					  
					  
					    
			 },
		 
		 prompt:function(option){
			  var that=this,
			      layout=$('<div class="zc-layout-c"></div>'),
			      mask=$('<div class="zc-mask-c"></div>'),
			      boundBox=$('<div class="zc-boundBox-c"></div>'),
				  modal_top=$('<div class="zc-modal-header"><button type="button" class="zc-close">×</button><h3>header</h3></div>'),
				  modal_body=$('<div class="zc-modal-body"><input type="text"></input></div>'),
				  modal_footer=$('<div class="zc-modal-footer"><a href="javascript::" class="zc-sure-c">确定</a><a href="javascript::" class="zc-cancle-c">取消</a></div>'),				  
				  content=$('<div></div>');
			      
				  $.extend(this.cfg,option||{});  //合并参数
			      
				  boundBox.css({'width':this.cfg.width    //设置样式
				                ,'height':this.cfg.height
								,'position':'fixed'
								,'top':this.cfg.top
								,'left':'50%'
								,'marginLeft':-parseInt(this.cfg.width)/2
								,'border':this.cfg.border
								,'position':'relative'							
								});			
				  
				  layout.append(mask);
				  boundBox.append(modal_top);
				  boundBox.append(modal_body);
				  boundBox.append(modal_footer);
				  layout.append(boundBox);			
			      $('body').append(layout);      //添加到body
				  
				  boundBox.find('.zc-sure-c').on('click',function(){  //点击确定按钮
					    that.cfg.callSureBack&&that.cfg.callSureBack.apply(layout);
						layout.remove();					  
					  });
					  
				  boundBox.find('.zc-cancle-c,.zc-close').on('click',function(){  //点击取消按钮
					    that.cfg.callCancleBack&&that.cfg.callCancleBack.apply(layout);
						layout.remove();					  
					  });				  
			 }	     	 	 	  
	  };


  function Drag(obj,option){  //拖拽
  	     this.obj=obj;
	  	 this.cfg={
	  	 	left:'0px',
	  	 	top:'0px'
	  	 }      
	  };


	   		  
	  return {
            Window:Window,
            Drag:Drag 
		  }		  
		  
})