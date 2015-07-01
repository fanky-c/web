  var Win_Width = 1024;
  var Win_Height = 400;
  var Radius = 8;
  var MarginTop = 30;
  var MarginLeft = 20;
  var endTimes = new Date(2015,3,24,0,0,0); //月份是从0开始
  var balls=[];
  var colors=['red','yellow','blue','gold','black','green'];

  window.onload = function() {
  	var canvas = document.getElementById('canvas');
  	var context = canvas.getContext('2d');
     
    Win_Width=document.documentElement.clientWidth;
    Win_Height=document.documentElement.clientHeight;
    Radius=Math.round(Win_Width*4/5/108)-1;

    MarginLeft=Win_Width/10;
    MarginTop=Win_Height/5;

  	canvas.width = Win_Width;
  	canvas.height = Win_Height;
  	curShowTimeSeconds=curentTimes();
    
    setInterval(function(){  //动画效果
        render(context);
        update();
    },50)
  };


  function update(){  //更新时钟
     var nextShowTimeSeconds=curentTimes();  //永远比curShowTimeSeconds慢
     var nextHours=parseInt(nextShowTimeSeconds / 3600);
  	 var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600) / 60);
  	 var nextSeconds = parseInt(nextShowTimeSeconds % 60);   
     
     var curHours=parseInt(curShowTimeSeconds / 3600);
  	 var curMinutes = parseInt((curShowTimeSeconds - curHours*3600) / 60);
  	 var curSeconds = parseInt(curShowTimeSeconds % 60);
     

  	 if(nextSeconds!=curSeconds){
          if(parseInt(curHours/10)!=parseInt(nextHours/10)){
                  addBalls(MarginLeft+0,MarginTop,parseInt(curHours/10))
          }

          if(parseInt(curHours%10)!=parseInt(nextHours%10)){
                  addBalls(MarginLeft + 15 * (Radius + 1), MarginTop,parseInt(curHours%10))
          }

          if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
                  addBalls(MarginLeft+38* (Radius + 1),MarginTop,parseInt(curMinutes/10))
          }

          if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
                  addBalls(MarginLeft + 53 * (Radius + 1), MarginTop,parseInt(curMinutes%10))
          }

          if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
                  addBalls(MarginLeft+76* (Radius + 1),MarginTop,parseInt(curSeconds/10))
          }

          if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
                  addBalls(MarginLeft + 91 * (Radius + 1), MarginTop,parseInt(curSeconds%10))
          }                                

         curShowTimeSeconds=nextShowTimeSeconds;
  	 } 
        updateBalls();   

  }

  function updateBalls(){  //更新小球
       for(var i=0;i<balls.length;i++){
            balls[i].x+=balls[i].vx;
            balls[i].y+=balls[i].vy;
            balls[i].vy+=balls[i].g;
            

            if(balls[i].y>=Win_Height-Radius){
               balls[i].y=Win_Height-Radius;
               balls[i].vy=-balls[i].vy*0.75;
            }
       }
       
       var cout=0;
       for(var i=0;i<balls.length;i++){
           if(balls[i].x+Radius>0 && balls[i].x-Radius<Win_Width){
                  balls[cout++]=balls[i];

           }          
       }
       //  while(balls.length>cout){
       //      balls.pop();
       // }
       balls.length=cout       
      console.log(balls.length+'---'+cout);

  }

  function addBalls(x,y,num){  //添加小球到数组
        for(var i=0;i<digit[num].length;i++){
               for(var j=0;j<digit[num][i].length;j++){
                    if(digit[num][i][j]==1){
                            var aBall={
                               x:x + j * 2 * (Radius + 1) + (Radius + 1),
                               y:y + i * 2 * (Radius + 1) + (Radius + 1),
                               g:1.2+Math.random(),
                               vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
                               vy:-8,
                               color:colors[Math.floor(Math.random()*colors.length)]
                            }

                            balls.push(aBall);
                    }
               }
        }
  };

  function render(cxt) {

     cxt.clearRect(0,0,Win_Width,Win_Height);  //清楚当前的上下文环境对象

  	var hours = parseInt(curShowTimeSeconds / 3600);
  	var minutes = parseInt((curShowTimeSeconds - hours*3600) / 60);
  	var seconds = parseInt(curShowTimeSeconds % 60);
     

  	renderDigit(MarginLeft, MarginTop, parseInt(hours / 10), cxt);
  	renderDigit(MarginLeft + 15 * (Radius + 1), MarginTop, parseInt(hours % 10), cxt); //时钟结束

  	renderDigit(MarginLeft + 30 * (Radius + 1), MarginTop, 10, cxt); //:

  	renderDigit(MarginLeft + 38 * (Radius + 1), MarginTop, parseInt(minutes / 10), cxt);
  	renderDigit(MarginLeft + 53 * (Radius + 1), MarginTop, parseInt(minutes % 10), cxt); //分钟结束

  	renderDigit(MarginLeft + 68 * (Radius + 1), MarginTop, 10, cxt); //:

  	renderDigit(MarginLeft + 76 * (Radius + 1), MarginTop, parseInt(seconds / 10), cxt);
  	renderDigit(MarginLeft + 91 * (Radius + 1), MarginTop, parseInt(seconds % 10), cxt); //秒钟结束         
    
    for(var i=0;i<balls.length;i++){  //创建小球
      cxt.fillStyle=balls[i].color;
      cxt.beginPath();
      cxt.arc(balls[i].x,balls[i].y,Radius,0,2*Math.PI,true);
      cxt.closePath();
      cxt.fill();   
    }
  }

  function renderDigit(x, y, num, cxt) { //每个数字进行显示个定位
  	cxt.fillStyle = "rgb(0,102,153)";
  	for (var i = 0; i < digit[num].length; i++) { //循环出行数
  		for (var j = 0; j < digit[num][i].length; j++) { //循环出列数
  			if (digit[num][i][j] == 1) {
  				cxt.beginPath();
  				cxt.arc(x + j * 2 * (Radius + 1) + (Radius + 1), y + i * 2 * (Radius + 1) + (Radius + 1), Radius, 0, 2 * Math.PI);
  				cxt.closePath();
  				cxt.fill();
  			}
  		}
  	}
  };

  function curentTimes() { //求出距离截止日期的秒数
  	var current = new Date().getTime();
  	t = endTimes.getTime() - current;
  	t=Math.round(t/1000);  //毫秒转化为秒数
  	return t > 0 ? t : 0;
  }