// JavaScript Document
(function(){
	function Module(a,b){
	     this.a=a;
		 this.b=b;    	
		};
		
	Module.prototype={
	    add:function(){return this.a+this.b},
		subd:function(){return this.a-this.b}	
		}
			
	 window.Module=Module; 	
})(window);