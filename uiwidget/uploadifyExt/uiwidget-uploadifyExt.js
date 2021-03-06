/**
 * Uploadify ext 批量上传扩展
 * @author kuanglingxuan@chinaduo.com
 */
;(function($){
	$.uiwidget = $.uiwidget || {};
	$.uiwidget.UploadifyExt = function(target, cfg){
		$.extend(this, cfg);
		this.target = target;
		this.init(cfg);
	};
	/**
	 * 类原型的相关属性和方法定义
	 */
	$.uiwidget.UploadifyExt.prototype = {
		data : {},
		queueIDs : [],
		errorIDs : [],
		rowHeight : null,
		allComplete : false,
		fileSizeKey : 'fileSize',
		stateKey : 'state',
		deleteKey : 'delete',
		countLimit : null,
		countOverLimit : false,
		/**
		 * 初始化
		 */
		init : function(cfg){
			var t = this;
			t.target.addClass('box_con');
			var html = '			<table class="uploadifyExt-main" cellspacing="0" cellpadding="0" border="0">'
						+'<tbody><tr>';
			$.each(t.headers, function(i, n){
				var className = 'uploadifyExt-align-left';
				if(n.align == 'center'){
					className = 'uploadifyExt-align-center';
				}else if(n.align == 'right'){
					className = 'uploadifyExt-align-right';
				}
				html += '	<th width="'+n.width+'" class="'+className+'">'+n.text+'</th>'
			});
						
            html += '</tr></tbody></table>';
			
			t.target.html(html);
			t.uploadifyId = 'uploadify'+new Date().getTime();
			$('#'+t.buttonPosition).append('<input type="file" name="uploadify" id="'+t.uploadifyId+'"/>');
			t.uploadify = $('#'+t.uploadifyId);
			var onSelect = cfg.onSelect;
			$.extend(cfg, {onSelect: function(event, queueID, fileObj){
				if(t.fileExt){//判断如果扩展名不符合就不做相应
					if(t.fileExt.indexOf(fileObj.type.toLowerCase()) == -1){
						t.uploadify.uploadifyCancel(queueID);
						return false;
					}
				}
				if(t.countLimit && t.countLimit <= t.queueIDs.length){
					t.countOverLimit = true;
					t.uploadify.uploadifyCancel(queueID);
				}else{
					t.countOverLimit = false;
					t.render(event, queueID, fileObj);
				}
				return onSelect(event, queueID, fileObj);
			}});
			var onSelectOnce = cfg.onSelectOnce;
			$.extend(cfg, {onSelectOnce: function(event, data){
				onSelectOnce(event, data, t.countOverLimit);
			}});
			
			var onProgress = cfg.onProgress;
			$.extend(cfg, {onProgress: function(event, queueID, fileObj, data){
				t.renderPercentage(event, queueID, fileObj, data);
				onProgress(event, queueID, fileObj, data);
			}});
			var onError = cfg.onError;
			$.extend(cfg, {onError: function(event, queueID, fileObj, errorObj){
				$('#'+queueID).find('td.state').html('<font name="uploadError" color="red">上传出错</font>');
				t.errorIDs.push(queueID);
				onError(event, queueID, fileObj, errorObj);
			}});
			var onAllComplete = cfg.onAllComplete;
			$.extend(cfg, {onAllComplete: function(event, data){
				t.allComplete = true;
				t.uploadify.uploadifyClearQueue();
				onAllComplete(event, data);
				$(t.queueIDs).each(function(i, n){
					if($.inArray(n, t.errorIDs) == -1){
						t.deleteRow(n);
					}
				});
				t.errorIDs = [];
			}});
			
			
			
			t.uploadify.uploadify(cfg);
			$('#'+t.startUpload).click(function(e){
				$(t.queueIDs).each(function(i, n){
					var dataRow = []; 
					$.each($('#'+n).find('td span'), function(i, n){
						dataRow.push($(n).text());
					//	alert($(n).text());
					});
					$(t.data).attr(n, dataRow);
				//	t.data.push(d);
				});
				
				t.handleStartUpload(t.uploadify, t.queueIDs, t.data);
			});
			$('#'+t.deleteAll).click(function(e){
				$(t.queueIDs).each(function(i, n){
					t.deleteRow(n);
				});
			});
		},
		/**
		 * 渲染html
		 * @param {Object} json
		 */
		render : function(event, queueID, fileObj){
			var t = this;
			if(t.allComplete){
				$(t.queueIDs).each(function(i, n){
					t.deleteRow(n);
				});
				t.allComplete = false;
			}
			//t.target.find('tr.gray, tr.white').remove();
			var trClass = t.target.find('table tr').last().attr('className');
			if(trClass == 'gray'){
				trClass = 'white';
			}else{
				trClass = 'gray';
			}
            var formatFileSize = t.formatFileSize(fileObj.size);
			var formatLimitSize = t.formatFileSize(t.sizeLimit);
			
			var html = '<tr id="'+queueID+'" class="'+trClass+'">';
			$.each(t.headers, function(i, n){
				var className = 'uploadifyExt-align-left';
				if(n.align == 'center'){
					className = 'uploadifyExt-align-center';
				}else if(n.align == 'right'){
					className = 'uploadifyExt-align-right';
				}
				if(n.key == t.deleteKey){
					html += '	<td width="'+n.width+'" class="'+className+'"><a title="删除" href="#" class="del"></a></td>';
				}else if(n.key == t.stateKey){
                    if (fileObj.size > t.sizeLimit) {
                        html += '	<td width="'+n.width+'" class="'+className+'"><font color="red">已超'+formatLimitSize+'上限</font></td>';
                    } else {
                        html += '	<td width="'+n.width+'" class="'+className+' '+t.stateKey+'">等待上传</td>';
                    }
				}else if(n.key == t.fileSizeKey){
					html += '	<td width="'+n.width+'" class="'+className+'">'+formatFileSize+'</td>';
				}else{
					var text = t.getDefaultText(n.key, fileObj);
					text = text.replace(new RegExp('&',"gm"),'');
					html += '	<td width="'+n.width+'" class="'+className+'"><a style="'+((text && text != null)?'display:none':'')+'" class="uploadifyExt-click-input" href="#">点击输入</a><span style="'+((text && text != null)?'':'display:none')+'" title="'+text+'" class="uploadifyExt-inner-span">'+text+'</span>';
					if(n.editAble){
						html += '<input style="display:none" type="text" class="uploadifyExt-input-text" value="'+text+'">';
					}
					html += '</td>';
				}
			});
			html += '</tr>';
			t.target.find('table').append(html);
			$('#'+queueID).find('td').has('input').click(function(e){
				$(this).find('input').show().focus();
				$(this).find('span').hide();
				$(this).find('a').hide();
			});	
			$('#'+queueID).find('.uploadifyExt-input-text').blur(function(e){
				$(this).parent().find('input').hide();
				$(this).parent().find('span').text($(this).parent().find('input').val());
				$(this).parent().find('span').attr('title', $(this).parent().find('input').val());
				if($(this).parent().find('span').text() == ''){
					$(this).parent().find('a').show();
				}else{
					$(this).parent().find('span').css('display', 'block');
				}
			});
			$('#'+queueID).find('.uploadifyExt-input-text').keyup(function(e){
				if(e.keyCode == 13){
					$(this).trigger('blur');
				}
			});
			$('#'+queueID).find('td a.uploadifyExt-click-input').click(function(e){
				$(this).parent().find('input').show().focus();
				$(this).parent().find('span').hide();
				$(this).hide();
				return false;
			});
			$('#'+queueID).find('td a.del').click(function(e){
				e.preventDefault();
				t.deleteRow(queueID);
			});	
			
			t.queueIDs.push(queueID);
		//	alert(t.queueIDs);
			t.rowHeight = $('#'+queueID).height();
			t.changeHeight(queueID);
		},
		changeHeight : function(queueID){
			var t = this;
			var countHeight = 12;
			if(t.queueIDs.length > countHeight){
				countHeight = t.queueIDs.length;
			}
			t.target.height(t.target.find('tr').first().height() + countHeight * t.rowHeight);
		},
		deleteRow : function(queueID){
			var t = this;
			if(t.onDelete && !t.onDelete(t.uploadify, t.queueIDs)){
				return;
			}
			$('#'+queueID).remove();
			if(!t.allComplete){
				t.uploadify.uploadifyCancel(queueID);
			}
			t.queueIDs.splice($.inArray(queueID, t.queueIDs), 1);
			t.changeHeight(queueID);
		},
		renderPercentage : function(event, queueID, fileObj, date){
		   	$('#'+queueID).find('td.'+this.stateKey).html(date.percentage+'%');
	   	},
		roundNum : function(f, c){
		   	var t = Math.pow(10, c);
		   	var tmp = (f * t)+0.000000001;
		   	var result = Math.round(tmp) / t;
		   	return result;
	   	},
		formatFileSize : function(byteSize){
			var t = this;
		   	byteSize = t.roundNum(byteSize / 1024, 2);
            var suffix = 'KB';
            if (byteSize > 1000) {
                byteSize = t.roundNum(byteSize / 1024, 2);;
                suffix = 'MB';
            }
		   	return byteSize+suffix;
	   	}
		,getFileEl : function(){
			return this.fileEl || (this.fileEl = this.target.find('input[type=file]'));
		}
	};
	
	$.fn.uploadifyExt = function(cfg){
		return new $.uiwidget.UploadifyExt(this, cfg);
	};
})(jQuery);