var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
canvas.style.background = '#60a3f0';

var ground = [];
var enemy = [];

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

var Platform = function(x,y) {
	this.x = x;
	this.y = y;
	this.w = 160;
	this.h = 40;
	this.draw = function() {
		for(var i=0; i<4; i++) {
			this.rect(this.x+(i*40),this.y);
		}
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
		ctx.fillStyle = "#127012";
		ctx.fillRect(this.x+5, this.y+5, 20, 20);
	};
};

var Enemy = function(x,y) {
	this.x = x;
	this.y = y;
	this.dx = 2;
	this.update = function() {
		this.y += this.dx;
		if(this.y+30 > 280) this.dx = -2;
		if(this.y < 100) this.dx = 2;
	};
	this.draw = function() {
		this.update();
		ctx.fillStyle = "#3b1111";
		ctx.fillRect(this.x, this.y, 30, 30);
		ctx.fillStyle = "#7d6125";
		ctx.fillRect(this.x+5, this.y+5, 20, 20);
	};
};

var Enemy2 = function(xCenter,y) {
	this.x = 0;
	this.y = y;
	this.xStep = 2;
	this.xCenter = xCenter;
	this.xMove = 2;
	this.update = function() {
		this.x = this.xCenter+this.xStep;
		if(this.x>this.xCenter+50) {
				this.xMove = -1;
		}
		if(this.x<this.xCenter-50) {
				this.xMove = 1;
		}
		this.xStep += this.xMove;
		if(keyRight) this.xCenter-=1;
		if(keyLeft) this.xCenter+=1;
	};
	this.draw = function() {
		this.update();
		ctx.fillStyle = "#3b1111";
		ctx.fillRect(this.x, this.y, 30, 30);
		ctx.fillStyle = "#7d6125";
		ctx.fillRect(this.x+5, this.y+5, 20, 20);
	};
};

for(var i=0; i<9; i++) {
	ground.push(new Ground((i*560),320));
}
for(var i=1; i<12; i++) {
	ground.push(new Platform((i*400),220));
	ground.push(new Enemy((i*400)-40,100+((i%2)*180)));
}
for(var i=1; i<12; i++) {
	ground.push(new Platform((i*400)+200,130));
}
for(var i=0; i<9; i++) {
	enemy.push(new Enemy2(280*i,290));
}

var player = new Player(200,280);

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
	if(keyRight) {
		sx -=1;
	}
	if(keyLeft)  {
		sx +=1;
	}
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
	for(var i=0; i<enemy.length; i++) {
		enemy[i].draw();
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