var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
canvas.style.background = '#60a3f0';

var ground = [];

var walkSpeed = 2;
var ySpeed = 0;
var jumpVelocity = 5;
var gravity = 0.1;

var keyTop = false;
var keyRight = false;
var keyLeft = false;

window.onkeydown = function(e) {
  switch(e.keyCode) {
    case 38 : keyTop = true; break;
    case 37 : keyLeft = true; break;
    case 39 : keyRight = true; break;
  }
};

window.onkeyup = function(e) {
  switch(e.keyCode) {
    case 38 : keyTop = false; break;
    case 37 : keyLeft = false; break;
    case 39 : keyRight = false; break;
  }
};

var Ground = function(x,y) {
	this.x = x;
	this.y = y;
	this.w = 400;
	this.h = 80;
	this.draw = function() {
		for(var i=0; i<10; i++) {
			this.rect(this.x+(40*i),this.y);
			this.rect(this.x+(40*i),this.y+40);
		}
	};
	this.rect = function(x,y) {
		ctx.fillStyle = "#753304";
		ctx.fillRect(x, y, 40, 40);
		ctx.fillStyle = "#c75c10";
		ctx.fillRect(x+5, y+5, 30, 30);
	};
};

var Cub = function(x,y) {
	this.x = x;
	this.y = y;
	this.w = 40;
	this.h = 40;
	this.draw = function() {
		this.rect(this.x,this.y);
	};
	this.rect = function(x,y) {
		ctx.fillStyle = "#753304";
		ctx.fillRect(x, y, 40, 40);
		ctx.fillStyle = "#c75c10";
		ctx.fillRect(x+5, y+5, 30, 30);
	};
};

var Player = function(x,y) {
	this.x = x;
	this.y = y;
	this.draw = function() {
		ctx.fillStyle = "#6b6009";
		ctx.fillRect(this.x, this.y, 30, 30);
	};
};

for(var i=0; i<8; i++) {
	ground.push(new Ground((i*400),320));
}
for(var i=1; i<12; i++) {
	ground.push(new Cub((i*280),280));
}

var player = new Player(200,290);

var placeFree = function(dx,dy) {
	for(var i=0; i<ground.length; i++) {
			ground[i].x += dx;
	}
	player.y += dy;
	var result = true;
	for(var i=0; i<ground.length; i++) {
		if(((player.x + 30 > ground[i].x) && (player.x < ground[i].x + ground[i].w))
			&&
			((player.y + 30 > ground[i].y) && (player.y < ground[i].y + ground[i].h))) {
			result = false;
			break;
		}
	}

	for(var i=0; i<ground.length; i++) {
			ground[i].x -= dx;
	}
	player.y -= dy;
	return result;
};


var update = function() {
	var isOnGround = !placeFree(0,1);
	if(isOnGround) {
		if(keyTop) {
			ySpeed = -jumpVelocity;
		}
	} else {
		ySpeed += gravity;
	}


	var sx = 0;
	if(keyRight) sx -=1;
	if(keyLeft)  sx +=1;
	if(sx != 0) {
		for(var i=0; i<walkSpeed; i++) {
			if(placeFree(sx, 0)) {
				for(var i=0; i<ground.length; i++) {
						ground[i].x += sx;
				}
			} else {
				break;
			}
		}
	}

	var ay = Math.round(ySpeed+0.5);
	var sy = 0;
	if(ay > 0) {
		sy = 1;
	} else if(ay < 0) {
		ay = -ay;
		sy = -1;
	}

	if(sy != 0) {
		for(var i=0; i<ay; i++) {
			if(placeFree(0,sy)) {
				player.y += sy;
			} else {
				ySpeed = 0;
				break;
			}
		}
	}
};

var draw = function() {
	for(var i=0; i<ground.length; i++) {
		ground[i].draw();
	}
	player.draw();
};

var game = function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	update();
	draw();

	requestAnimationFrame(game);
};

console.log(ground);

game();