;(function($){$.uiwidget=$.uiwidget||{};$.uiwidget.Messagebox=function(target,cfg){$.extend(this,cfg);this.messagebox=$(target);this.init();this.render()};$.uiwidget.Messagebox.prototype={OK_TEXT:'确 定',CANCEL_TEXT:'取 消',CLOSE_TEXT:'关 闭',ASK_TITLE:'提示',ALERT_TITLE:'警告',SUCCESS_TITLE:'成功',ERROR_TITLE:'失败',WIDTH:426,init:function(){var SELF=this;$(window).bind('resize',function(){SELF.reLayout()});$(window).bind('scroll',function(){SELF.reLayout()})},render:function(){},renderWindow:function(){var windowContent=$(['<div class="pop_box" onselectstart="return false;" style="-moz-user-select: none;width:'+WIDTH+'px;"><div class="pop_title"><div class="pop_title_left"><div class="pop_title_right">','<div class="pop_title_midle"></div><span class="pop_close" title="关闭" ></span>','</div></div></div>','<div class="pop_content" style="width:'+(WIDTH-2)+'px;">','<div class="msg-window-ico-prompt"></div><div class="msg-window-msg-content"><table cellpadding="0" cellspacing="0"><tr><td></td></tr></table>','</div>','<div class="msg-window-button" >','</div> ','</div>','</div>'].join(''));$(document.body).append(windowContent);this.titleEl=windowContent.find('div.pop_title_midle');this.msgEl=windowContent.find('div.pop_content td');this.iconEl=windowContent.find('div.pop_content>div')[0];this.buttonEl=windowContent.find('div.msg-window-button');return windowContent},renderMask:function(){var maskContent=$('<div class="mask"><iframe frameborder="0" style="width:100%;height:100%"></iframe></div>');$(document.body).append(maskContent);return maskContent},message:function(args){if(args.width){WIDTH=args.width}else{WIDTH=426}this.show();if(args.type)this[args.type](args);else this.customCommand(args)},customCommand:function(args){if(args.title)this.setTitle(args.title);this.setMsg(args.msg);if(args.iconCls)this.setIconCls(args.iconCls);this.reSetWidth(WIDTH);var mw=this.getWindow();var scrollLeft=(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);var scrollTop=(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);mw.css('left',($(window).width()-mw.eq(0).width())/2+scrollLeft);mw.css('top',($(window).height()-mw.eq(0).height())/2+scrollTop);mw.css('z-index',20003);if(args.buttons)this.setButton(args.buttons);var t=this;this.windowEl.find("div.btn-order").each(function(i){$(this).bind("click",function(){if(args.fn)args.fn({index:i},args.msg);t.hide()});$(this).find("li.middle-normal").hover(function(){$(this).prev().addClass('left-over');$(this).addClass('middle-over');$(this).next().addClass('right-over')},function(){$(this).prev().removeClass('left-over');$(this).removeClass('middle-over');$(this).next().removeClass('right-over')})});this.windowEl.find("span.pop_close").unbind("click");this.windowEl.find("span.pop_close").bind("click",function(){if(args.fn)args.fn({index:-1},args.msg);t.hide()})},ask:function(args){this.setTitle(this.ASK_TITLE);this.setIconCls('msg-window-ico-prompt');this.setButton([{text:this.OK_TEXT,iconCls:'ico-btn-order-ok'},{text:this.CANCEL_TEXT,iconCls:'ico-btn-order-close'}]);this.customCommand(args)},alert:function(args){this.setTitle(this.ALERT_TITLE);this.setIconCls('msg-window-ico-warning');this.setButton([{text:this.OK_TEXT,iconCls:'ico-btn-order-ok'}]);this.customCommand(args)},success:function(args){this.setTitle(this.SUCCESS_TITLE);this.setIconCls('msg-window-ico-success');this.setButton([{text:this.OK_TEXT,iconCls:'ico-btn-order-ok'}]);this.customCommand(args)},error:function(args){this.setTitle(this.ERROR_TITLE);this.setIconCls('msg-window-ico-error');this.setButton([{text:this.OK_TEXT,iconCls:'ico-btn-order-ok'}]);this.customCommand(args)},getWindow:function(){return this.windowEl||(this.windowEl=this.renderWindow())},getMask:function(){return this.maskEl||(this.maskEl=this.renderMask())},setTitle:function(title){this.titleEl.html(title)},setMsg:function(text){this.msgEl.html(text)},setIconCls:function(css){this.iconEl.className=css},reSetWidth:function(w){var currentObj=this.getWindow();currentObj.find("div.pop_content").css("width",w-2);currentObj.css("width",w)},setButton:function(buttons){this.buttonEl.empty();for(var i=0;i<buttons.length;i++)if(buttons[i].iconCls)this.buttonEl.append(['<div class="btn-order"><input type="button" class="pop_btn ',buttons[i].iconCls,'" id="delete_ajax" value="',buttons[i].text,'"></div>'].join(''));else this.buttonEl.append(['<div class="btn-order"><ul><li class="left-normal"></li><li class="middle-normal">',buttons[i].text,'</li><li class="right-normal"></li></ul></div>'].join(''))},show:function(){this.getWindow().show();this.getMask();var newHeight=document.body.scrollHeight;if(document.body.scrollHeight<=document.body.clientHeight){newHeight=document.body.clientHeight}if($.browser.mozilla)newHeight=$(document).height();$("div.mask").height(newHeight).show()},hide:function(){this.getWindow().hide();this.getMask().hide()},reLayout:function(){var mw=this.getWindow();var scrollLeft=(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);var scrollTop=(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);mw.css('left',($(window).width()-mw.eq(0).width())/2+scrollLeft);mw.css('top',($(window).height()-mw.eq(0).height())/2+scrollTop)}};$.messagebox=function(cfg){$.uiwidget.Messagebox.instance=$.uiwidget.Messagebox.instance||new $.uiwidget.Messagebox(document.body,{});return $.uiwidget.Messagebox.instance.message(cfg)}})(jQuery);