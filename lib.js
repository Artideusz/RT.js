const rt = {
	//Browser inner width
	scrW : window.innerWidth,
	//Browser inner height
	scrH : window.innerHeight,
	//Maths object
	math : {
		//Adds all arguments together and returns value
		add : (...nums)=>{
			return nums.reduce((total,cur)=>{return total+cur});
		},
		//Subtracts first argument from the rest
		sub : function(main,...subt){
			return main - this.add(...subt);
		},
		//Returns distance between 2 objects
		dist : (a,b)=>{
			return Math.sqrt(Math.pow(Math.abs(a.x - b.x),2)+Math.pow(Math.abs(a.y - b.y),2));
		},
		//Returns difference between 2 values
		diff : (p1,p2)=>{
			return Math.abs(p1-p2);
		},
		//Returns random number (Minimum val, Maximum val)
		random : (min,max)=>{
			return Math.floor(Math.random()*(+max-min+1)+min);
		},
		avg : function(...values){
			return (this.add(...values)/values.length).toFixed(3);
		},
		
	},

	canvas : {
		//canvas Element
		c : null,
		fps : 0,
		//Loop function
		main_loop_function : null,
		//Interval storage variable
		interval : null,
		//context of canvas (c)
		draw : null,
		//Mouse position
		mouseX : null,
		mouseY : null,
		//Key that is pressed
		key:null,
		keyIsDown:false,
		//Creates canvas
		create : function(w=rt.scrW,h=rt.scrH,x=0,y=0){
			if(this.c){
				console.error('canvas already created');
			}else{
				this.c = document.createElement('canvas');
				this.c.width = w-2;
				this.c.height = h-2;
				this.draw = this.c.getContext('2d',{alpha : false});
				this.c.style = `position:absolute;z-index:-1; top:${y}px; left:${x}px; border:1px solid black`;
				document.body.appendChild(this.c);
				window.addEventListener("keydown",(e)=>{if(rt.canvas.keyIsDown===false){rt.canvas.key = e.keyCode;console.log(e.keyCode); rt.canvas.keyIsDown = true;}});
				window.addEventListener("keyup",()=>{rt.canvas.key = false; rt.canvas.keyIsDown = false;});
				this.c.addEventListener('mousemove',function(e){
					rt.canvas.mouseX = e.clientX;
					rt.canvas.mouseY = e.clientY;
				});
			}
		},
		//Object shapes
		Object : {
			//Creates a point
			point : function(x=0,y=0,other={}){
				return Object.assign(other,{
					x:x,
					y:y,
					draw : function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.fillStyle = clr;
							rt.canvas.draw.fillRect(this.x,this.y,1,1);
						}
					}
				});
			},
			text : function(text,font='12px sans-serif',x,y,other={}){
				return Object.assign(other,{
					text : text,
					font : font,
					x : x,
					y : y,
					offsetX : null,
					draw : function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.font = this.font;
							this.offsetX = rt.canvas.draw.measureText(text).width
							rt.canvas.draw.fillStyle = clr;
							rt.canvas.draw.fillText(this.text,this.x-this.offsetX/2,this.y);
						}
					}
				
				})
			},
			line : function(pa={x:0,y:0},pb={x:50,y:50},other={}){
				return Object.assign(other,{
					x1:pa.x,
					x2:pb.x,
					y1:pa.y,
					y2:pb.y,
					draw:function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.strokeStyle = clr;
							rt.canvas.draw.beginPath();
							rt.canvas.draw.moveTo(this.x1,this.y1);
							rt.canvas.draw.lineTo(this.x2,this.y2);
							rt.canvas.draw.stroke();
						}
					}
				})
			},
			rect : function(x,y,w,h,other = {}){
				return Object.assign(other,{
					x:x,
					y:y,
					w:w,
					h:h,
					offsetX:w/2,
					offsetY:h/2,
					draw:function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.fillStyle = clr;
							rt.canvas.draw.fillRect(this.x-this.offsetX,this.y-this.offsetY,this.w,this.h);
						}
					}
				})
			},
			circle : function(x,y,r,other = {}){
				return Object.assign(other,{
					x:x,
					y:y,
					r:r,
					draw : function(clr='#000', fill=false){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.strokeStyle = clr;
							rt.canvas.draw.beginPath();
							rt.canvas.draw.arc(this.x,this.y,this.r,0,2*Math.PI);
							rt.canvas.draw.stroke();
							if(fill){
								rt.canvas.draw.fillStyle = fill;
								rt.canvas.draw.fill();
							}
						}
					}
				})
			},
			poly : function(other={},...points){ // [{x:? y:?}, {x:?,y:?},...] <- points
				return Object.assign(other,{
					points : points,
					width : (()=>{
						let biggest=0;
						let smallest=Infinity;
						for(let i = 0 ; i < points.length ; i++){
							if(points[i].x >= biggest){
								biggest = points[i].x;
							}else if(points[i].x<=smallest){
								smallest = points[i].x;
							}
						}
						return biggest-smallest;
					})(),
					height : (()=>{
						let biggest=0;
						let smallest=Infinity;
						for(let i = 0 ; i < points.length; i++){
							if(points[i].y >= biggest){
								biggest = points[i].y;
							}else if(points[i].y<=smallest){
								smallest = points[i].y;
							}
						}
						return biggest-smallest;
					})(),
					poly : (()=>{
						let array = [];
						for(let i = 0 ; i < points.length ; i++){
							if(i == points.length-1){
								array[i] = new rt.canvas.Object.line(points[i],points[0]);
							}else{
								array[i] = new rt.canvas.Object.line(points[i],points[i+1]);
							}
						}
						return array;
					})(),
					draw:function(clr='#000'){
						if(!rt.canvas.c){
							console.error('No where to draw');
						}else{
							rt.canvas.draw.strokeStyle = clr;
							rt.canvas.draw.beginPath();
							for(let i = 0 ; i < this.poly.length ; i++){
								rt.canvas.draw.moveTo(this.poly[i].x1,this.poly[i].y1);
								rt.canvas.draw.lineTo(this.poly[i].x2,this.poly[i].y2);
							}
							rt.canvas.draw.stroke();
						}
					}
				})
			},
			Collision : {
				pointToPoint : function(p1,p2){
					console.log(rt.math.dist(p1.x,p2.x,p1.y,p2.y));
					if(rt.math.dist(p1.x,p2.x,p1.y,p2.y)<=0.1){
						return true;
					}else{
						return false;
					}
				},
				pointToCircle : function(p,c){
					if(rt.math.dist(p.x,c.x,p.y,c.y)<=c.r){
						return true;
					}else{
						return false;
					}
				},
				circleToCircle : function(c1,c2){
					if(rt.math.dist(c1,c2)<=c1.r+c2.r){
						return true;
					}else{
						return false;
					}
				},
				pointToRect : function(p,r){
					if(	p.x > r.x - r.offsetX && //Left side |.
						p.x < r.x + r.offsetX && //Right side .|
						p.y > r.y - r.offsetY && // Top side -.
						p.y < r.y + r.offsetY){
						return true;
					}else{
						return false;
					}
				}
			}
		},
		gameFuncs : { //Add functions to objects
			border : function(){ //Border blockage ***Make it more self dependant***
				if (this.y > rt.canvas.c.height-this.r) {
					if(this.grav && this.gravSpd){
						this.gravSpd=-this.gravSpd/1.2;		
					}
					else{
						this.velY=-this.velY;
					}
					this.y = rt.canvas.c.height-this.r;
				}else if(this.y < 0+this.r){
					if(this.grav && this.gravSpd){
						this.gravSpd =-this.gravSpd;
					}else{
						this.velY=-this.velY;
					}
				}if(this.x > rt.canvas.c.width-this.r){
					this.x = rt.canvas.c.width-this.r;
					this.velX=-this.velX/1.1;
				}else if(this.x < 0+this.r){
					this.x = 0+this.r;
					this.velX=-this.velX/1.1;
				}
			},
			gravity : function(gravStrength = 0.02){
				return {
					grav : gravStrength,
					gravSpd : 0,
				}
			},
			update : function(){
				this.x += this.velX;
				this.y += this.velY;
			},

		},
		remove : function(){
			if(this.c == null || !this.c){
				console.error('no canvas to remove');
			}else{
				document.body.removeChild(this.c);
				this.c = null;
				this.draw = null;
				if(typeof this.interval == 'function'){
					clearInterval(this.interval);
				}
				this.interval = null;
			}
		},
		setFps : function(fps){
			this.fps = fps;
		},
		setLoop : function(func){
			this.main_loop_function = func;
		},
		startLoop : function(){
			if(!this.main_loop_function){
				console.error('Cannot start without loop (Please Set loop function)');
			}else if(typeof this.interval == 'function'){
				console.error('loop already running');
			}else if(this.fps <= 0 ){
				console.log('fps less than 0');
			}else{
				this.interval = setInterval(this.main_loop_function,1000/this.fps);
			}
		},
		stopLoop : function(){
			if(!this.interval){
				console.error('Loop already stopped');
			}else{
				clearInterval(this.interval);
				this.interval = null;
			}
		},
		clear : function(clr){
			if(!this.draw){
				console.error('draw function not set');
			}else{
				if(clr){
					this.draw.fillStyle = clr;
					this.draw.fillRect(0,0,this.c.width,this.c.height);
				}else{
					this.draw.clearRect(0,0,this.c.width,this.c.height);
				}
			}
		},
		//Executes callback after TIME = ms or time*fps
		Counter : function(time,callback=()=>{}){
			return {
				count : 0,
				sec : 0,
				pause : false,
				start : function(){
					pause=false;
				},
				next : function(){
					if(!this.pause){
						this.count++;
						if(this.count>=time){
							this.count=0;
							this.sec++;
							callback();
						}
					}
				},
				reset : function(){
					this.count = 0;
					this.sec = 0;
				},
				stop : function(){
					pause=true;
				}
			}
		}
	},
	help : function(){
		console.log(this.desc);
	},
	randomName : function(){
		let o = ['Bear','Troll','Toxic','Money','Creep','One-legged','Polish','Poor','Freaky'];
		let t = ['Licker','Cuddler','Leader','Maker','Wrestler','Grabber','Thrower','Swimmer','Hiker'];
		return o[rt.math.random(0,o.length-1)]+t[rt.math.random(0,t.length-1)]+rt.math.random(0,999);
	}
}







let poly;


onload = ()=>{
	// rt.canvas.create();
	// rt.canvas.setFps(60);
	// circle = new rt.canvas.Object.circle(rt.canvas.c.width/2,rt.canvas.c.height/2,100);
	// line = new rt.canvas.Object.line({x : rt.canvas.c.width/2, y : rt.canvas.c.height/2-50},{x : rt.canvas.c.width/2, y : rt.canvas.c.height/2+50},{
	// 	update : function(){
	// 		this.x1 = rt.canvas.c.width/2;
	// 		this.y1 = rt.canvas.c.height/2-50;
	// 	},
	// 	center : rt.math.avg(this.x1,this.x2,this.y1,this.y2),
	// });
	// rt.canvas.setLoop(()=>{
	// 	rt.canvas.clear();
	// 	line.update();
	// 	circle.draw();
	// 	line.draw();
	// })
	// rt.canvas.startLoop();

	rt.canvas.create();
	rt.canvas.setFps(60);
	poly = new rt.canvas.Object.poly({
		key : null,
		xV : 0,
		yV : 0,
		rotation : 0.1,
		updateAll : function(){
			switch(rt.canvas.key){
				case 37: //left
					this.yV=0;
					this.xV=-1;
					break;
				case 38: //up
					this.yV=-1;
					this.xV=0;
					break;
				case 39: // right
					this.yV=0;
					this.xV=1;
					break;
				case 40: //down
					this.yV=1;
					this.xV=0;
					break;
				case 32 :
					rt.canvas.draw.rotate(this.rotation*Math.PI/180);
					break;
				default:
					this.yV=0;
					this.xV=0;
					break;
			}
			for(let i = 0 ; i < this.poly.length ; i++){
				this.poly[i].x1 += this.xV;
				this.poly[i].x2 += this.xV;
				this.poly[i].y1 += this.yV;
				this.poly[i].y2 += this.yV;
			}

		}
	},{x:200,y:100},{x:250,y:150},{x:250,y:200},{x:200,y:250},{x:150,y:250},{x:100,y:200},{x:100,y:150},{x:150,y:100});
	rt.canvas.setLoop(()=>{
		rt.canvas.clear();
		poly.updateAll();
		poly.draw();
	});
	rt.canvas.startLoop();
}

