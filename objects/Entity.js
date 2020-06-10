class Entity{

	constructor(ctx, x, y, key){

		this.MAP_OFFSET = ctx.CONFIG.map_offset;
		this.TILE_SIZE = ctx.CONFIG.tile;
		this.helper = new Helper();

		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.width = 32;
		this.height = 32;
		this.depth = 0;

		this.key = key;

		this.frames = {
			idle: 1,
			hurt: 3
		};

		this.states = {
			idle: 		true,
			walk: 		false,
			hurt: 		false,
			defeated: 	false,
			last: 		false
		};

		this.direction = {
			last: false,
			current: 'down'
		};

		this.health = {
			total: 	 1,
			current: 1
		};

		this.speed = {
			base: 	 0,
			current: 0,
			max: 	 0
		};

		this.setTilePosit();
		this.createShadow();
		this.createSprite();
		
	}

	createSprite(){
		this.spr = this.ctx.add.sprite(this.x, this.y, this.key);
		this.spr.setOrigin(0.5);
	}

	destroy(){ //Se eliminan los sprites tanto de la sombra como de la clase desde la que estemos llamando
		if(this.spr){
			this.spr.destroy();
		}

		this.destroyShadow();
		this.spr = false;
	}

	createShadow(){ //Se crea el sprite de la sombra

		this.shadow = this.ctx.add.graphics({x: this.x, y: this.y});

		let alpha = 0.1;
		let radius = 10;

		this.shadow.fillStyle('0x000000', alpha);
		this.shadow.fillCircle(0, 0, radius);
	}

	destroyShadow(){

		if (this.shadow){
			this.shadow.destroy();
		}

		this.shadow = false;

	}

	startNewAn(key){ //Inicializa las animaciones tanto del personaje como de los enemigos

		this.stopAn();

		switch(key){
			case 'idle':
				this.startIdleAn();
				break;
			case 'walk':
				this.startWalkAn();
				break;
			case 'walk-left':
				this.startWalkLeftAn();
				break;
			case 'walk-right':
				this.startWalkRightAn();
				break;
			case 'defeated':
				this.startGameOverAn();
				break;
			case 'hurt':
				this.startHurtAn();
				break;
		}

	}

	startIdleAn(){
		this.spr.setFrame(this.frames.idle);
	}

	startWalkAn(){
		this.spr.play(this.key + '-walk', true);
	}

	startWalkLeftAn(){
		this.spr.play(this.key + '-walk-left', true);
	}

	startWalkRightAn(){
		this.spr.play(this.key + '-walk-right', true);
	}

	startHurtAn(){
		this.spr.setFrame(this.frames.idle);
	}

	startGameOverAn(){
		this.spr.play('bones');
		//this.spr.setFrame(this.frames.idle);
	}

	stopAn(){
		this.spr.anims.stop();
		this.spr.setFrame(this.frames.idle);
	}

	//Setters

	setSpritePosit(x,y){ //Controla la posición en la que se encuentra el sprite del personaje

		if(typeof x === 'number'){
			this.x = x;
		}

		if(typeof y === 'number'){
			this.y = y;
		}

		this.spr.setX(this.x);
		this.spr.setY(this.y);

		if (this.shadow){
			this.shadow.setX(this.x);
			this.shadow.setY(this.y);
		}

		this.setTilePosit();

	}

	setSpritePositMonsters(x,y){ //Controla la posición en la que se encuentra el sprite de los enemigos

		if(typeof x === 'number'){
			this.x = x;
		}

		if(typeof y === 'number'){
			this.y = y;
		}

		if (this.shadow){
			this.shadow.setX(this.x);
			this.shadow.setY(this.y);
		}

		this.setTilePosit();

	}

	setTilePosit(){

		let tile = this.helper.convertPxToTile(
			this.x, this.y, this.TILE_SIZE
		);

		this.tx = tile.tx;
		this.ty = tile.ty;

	}

	setDepth(depth){ //Establece la profundidad del sprite
		this.depth = depth;
		this.spr.setDepth(depth);
		if(this.shadow){
			this.shadow.setDepth(depth);
		}
	}

	setState(key){ //Establece el estado del sprite
		if(this.states.last === key) return;
		this.resetStates();
		this.states[key] = true;
		this.states.last = key;
	}

	resetStates(){
		for (let key in this.states){
			this.states[key] = false;
		}
	}

	setHealth(current, total){ //Controla la salud del personaje
		if(typeof total === 'number'){
			this.health.total = total;
		}
		this.health.current = Math.min(current, this.health.total);
	}

	//Getters que devuelven la posición del bloque que ocupa el personaje

	getLeftX(){
		return this.x - 0.5 * this.width;
	}

	getRightX(){
		return this.x + 0.5 * this.width;
	}

	getTopY(){
		return this.y - 0.5 * this.height;
	}

	getBottomY(){
		return this.y + 0.5 * this.height;
	}

	getCenter(){
		return{
			x: this.x,
			y: this.y
		};
	}

	getTilePosit(){
		return {
			tx: this.tx,
			ty: this.ty
		}
	}

	getTopLeftTile(){

		let x = this.getLeftX() - this.MAP_OFFSET;
		let y = this.getTopY();
		let tx = Math.floor(x / this.TILE_SIZE);
		let ty = Math.floor(y / this.TILE_SIZE);

		return {
			tx: tx,
			ty: ty
		};

	}

	getTopRightTile(){

		let x = this.getRightX() - this.MAP_OFFSET;
		let y = this.getTopY();
		x--;
		let tx = Math.floor(x / this.TILE_SIZE);
		let ty = Math.floor(y / this.TILE_SIZE);

		return {
			tx: tx,
			ty: ty
		};

	}

	getBottomLeftTile(){

		let x = this.getLeftX() - this.MAP_OFFSET;
		let y = this.getBottomY();
		y--;
		let tx = Math.floor(x / this.TILE_SIZE);
		let ty = Math.floor(y / this.TILE_SIZE);

		return {
			tx: tx,
			ty: ty
		};

	}

	getBottomRightTile(){

		let x = this.getRightX() - this.MAP_OFFSET;
		let y = this.getBottomY();
		x--;
		y--;
		let tx = Math.floor(x / this.TILE_SIZE);
		let ty = Math.floor(y / this.TILE_SIZE);

		return {
			tx: tx,
			ty: ty
		};

	}

}