// JavaScript Document
require.config({
      paths:{
		   'jquery':'jquery-1.9.0' 
		  }
	})
require(['jquery','Window'],function($,w){

         $('.a1').on('click',function(){
			    new w.Window().alert({
				      width:'500px',
					  height:'auto',
					  top:'200px',
					  content:'我是模仿alert的',
					  callBack:function(){
						     alert('关闭'); 
						  }	
					}) 
			 });

         $('.a2').on('click',function(){
			    new w.Window().confirm({
				      width:'500px',
					  height:'auto',
					  top:'200px',
					  content:'我是模仿confirm的',
					  callSureBack:function(){
						     alert('确定'); 
						  },
					  callCancleBack:function(){
						     alert('取消'); 
						  }						  	
					}) 
			 });
			 
         $('.a3').on('click',function(){
			    new w.Window().prompt({
				      width:'500px',
					  height:'auto',
					  top:'200px',
					  callSureBack:function(){
						     alert('你输入的内容是:'+ $(this).find('input').val()); 
						  },
					  callCancleBack:function(){
						     alert('取消'); 
						  }						  	
					}) 			    	
			 });
			 			 						 			 
})