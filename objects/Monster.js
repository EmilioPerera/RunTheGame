class Monster extends Entity{

	constructor (ctx, x, y, key){
		super(ctx, x, y, key);
		this.speed = {
			base: 2,
			current: 2,
			max: 6
		};
		
		this.setHealth(3, 3);
		this.helper = new Helper();

	}

	update(){
		if(this.states.walk){
			this.enemyPatrol();
		}
	}

	enemyPatrol(){ //Comienza el movimiento de patrulla de los monstruos
		this.spr.play('skeleton-walk-left', true);
		this.moveLeft();
	}

	moveLeft(){

		if(this.key === 'ghost') //Se establece la velocidad a la que se moverá el monstruo en función del tipo del que se haya generado
			this.xAux = 1;
		else if(this.key === 'skeleton')
			this.xAux = 2;
		else if(this.key === 'darkSlime')
			this.xAux = 3;
		else if(this.key === 'darkWizard')
			this.xAux = 3;
		else if(this.key === 'pumpkin')
			this.xAux = 3;
		//this.xAux = this.helper.getRandInt(1,3); //Si quisiéramos generarlo de manera aleatoria (Se actualiza cada vuelta que dan)
		this.aux = 0;
		this.spr.play(this.key + '-walk-left', true);

		for(var i = 1; i < 50; i++){
			setTimeout(() => {
				if(this.isBlocked != true){
				this.handleCollisionMonster('left'); 
				this.monsterPosit();
				this.aux++;
				this.x -= this.xAux;
				this.setSpritePosit();
			}
			else if(this.isBlocked === true){
				i = 50;
			}
			}, i*100);
		}

		setTimeout(() => {this.moveRight(this.xAux);}, 5000);
	}

	moveRight(xAux){
		this.xAux = xAux;
		this.aux = 0;
		this.spr.play(this.key + '-walk-right', true);
		for(var i = 1; i < 50; i++){

			setTimeout(() => {
				if(this.isBlocked != true){
				this.handleCollisionMonster('right'); 
				this.monsterPosit();
				this.aux++;
				this.x += this.xAux;
				this.setSpritePosit();
				}
				}, i*100);
			}
			setTimeout(() => {this.moveLeft();}, 5000);
	}

	handleCollisionMonster(direction){ //Comprobamos las colisiones

		var tile1, tile2, now, corr;

		switch(direction){
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

	}

	monsterPosit(){ //Controla la posición en la que se encuentra el monstruo
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
		this.ctx.generator.checkPositMonster(now.tx, now.ty);
	}

}