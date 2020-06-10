class Player extends Entity{

	constructor(ctx, x, y, key){
		super(ctx, x, y, key);
		this.speed = {
			base: 2,
			current: 2,
			max: 6
		};
		
		this.setHealth(3, 3);
	}

	update(is_holding){

		if (this.states.defeated) return;

		this.setCurrentDirection(is_holding);

		if(this.states.walk){
			this.moveSprite();
		}

		this.checkScrollDeath();

		this.playerPosit();

	}

	moveSprite(){ //Se controla la dirección en la que se mueve el personaje

		switch(this.direction.current){
			case 'down':
				this.moveDown();
				break;
			case 'left':
				this.moveLeft();
				break;
			case 'right':
				this.moveRight();
				break;
		}

	}

	checkScrollDeath(){ //Se comprueba si el personaje ha sido alcanzado por el techo

		if(this.states.defeated) return;

		if(this.getTopY() <= Math.round(this.ctx.cameras.main.scrollY + 0.75 * this.TILE_SIZE)){
			this.gameOver();
		}

	}

	gameOver(){ //Actualiza la información del personaje cuando acaba la partida

		if(this.states.defeated) return;

		this.health.current = 0;

		this.setState('defeated');
		this.startNewAn('defeated');

	}	

	startMoving(){
		this.setState('walk');
		this.startNewAn('walk');
	}

	stopMoving(){
		this.setState('idle');
		this.startNewAn('idle');
	}

	moveDown(){
		this.spr.play(this.key + '-walk', true);
		this.y += this.speed.current;
		this.handleCollision('down');
		this.setSpritePosit();
	}

	moveLeft(){
		this.spr.play(this.key + '-walk-left', true);
		this.x -= this.speed.current;
		this.handleCollision('left');
		this.setSpritePosit();
		//this.spr.play('hero-walk-left');
	}

	moveRight(){
		this.spr.play(this.key + '-walk-right', true);
		this.x += this.speed.current;
		this.handleCollision('right');
		this.setSpritePosit();
	}

	handleCollision(direction){ //Comprueba las colisiones del personaje

		var tile1, tile2, now, corr;

		switch(direction){
			case 'down':
				tile1 = this.getBottomLeftTile();
				tile2 = this.getBottomRightTile();
				now = this.helper.convertPxToTile(
					this.x, this.getBottomY(), this.TILE_SIZE
				);
				corr = { //Posición corregida en el caso de que el bloque al que esté intentando acceder esté bloqueado
					x: this.x,
					y: this.helper.getTileCenter(
						now.tx, now.ty - 1, this.TILE_SIZE
					).y
				};

				break;
			case 'left':
				tile1 = this.getTopLeftTile();
				tile2 = this.getBottomLeftTile();
				now = this.helper.convertPxToTile(
					this.getLeftX(), this.y, this.TILE_SIZE
				);
				corr = {
					x: this.helper.getTileCenter(
						now.tx + 1, now.ty, this.TILE_SIZE
					).x,
					y: this.y
				};
				break;
			case 'right':
				tile1 = this.getTopRightTile();
				tile2 = this.getBottomRightTile();
				now = this.helper.convertPxToTile(
					this.getRightX(), this.y, this.TILE_SIZE
				);
				corr = {
					x: this.helper.getTileCenter(
						now.tx - 1, now.ty, this.TILE_SIZE
					).x,
					y: this.y
				};
				break;
		}

		var is_tile1_wall = this.ctx.generator.checkTileBlocked(tile1);
		var is_tile2_wall = this.ctx.generator.checkTileBlocked(tile2);
		//var is_enemy		= this.ctx.generator.checkTileBlocked()

		if (is_tile1_wall || is_tile2_wall){
			this.x = corr.x;
			this.y = corr.y;
		}

	}

	playerPosit(){ //Controla la posición del personaje

		var now, corr;
		now = this.helper.convertPxToTile(
					this.getRightX(), this.y, this.TILE_SIZE
				);
		corr = {
				x: this.helper.getTileCenter(
					now.tx, now.ty, this.TILE_SIZE
				).x,
				y: this.y
			};

		this.ctx.generator.checkPositPlayer(now.tx, now.ty);

	}

	setCurrentDirection(is_holding){ //Pone al personaje a caminar hacia delante si no se está moviendo hacia ninguno de los lados
		if(is_holding){
			this.direction.current = is_holding;
		}
		else {
			this.direction.current = 'down';
		}
	}

}