class Generator{

	constructor(ctx){
		this.CONFIG 	= ctx.CONFIG;
		this.DEPTH 		= ctx.DEPTH;
		this.ctx 		= ctx;
		this.cols 		= 11;
		this.rows 		= 20;
		this.objects = {
			floor: 		[],
			walls: 		[],
			monsters: 	[],
			pickups: 	[],
			overlay: 	false
		};
		this.helper = new Helper();
		this.height = 0;
		this.ty_offset = 0;
		this.px_offset = 0;
		this.executing;
		this.executingObj;

	}

	setup(){
		this.createFloor();
		this.createRoomObj();
		this.drawOverlay();
	}

	update(monsters){
		this.controlRooms();
		this.scrollFloor();
	}

	createRoomObj(){ //Crea todos los objetos y enemigos del mapa

		var walls = this.generateWalls();
		walls = this.createWalls(walls);
		this.objects.walls = this.objects.walls.concat(walls);
		this.saveHeight();

	}

	controlRooms(){
		//Se comprueba si la cámara ha llegado al final de la sala
		if(this.ctx.cameras.main.scrollY + this.ctx.cameras.main.height < this.height){
			return;
		}
		this.ty_offset = Math.floor(this.ctx.cameras.main.scrollY / this.CONFIG.tile);
		this.px_offset = this.ctx.cameras.main.scrollY;
		this.destroyPassedRows(); //Se borran las filas que ya no aparecen en la cámara
		this.createRoomObj(); //Se crean las nuevas filas
	}

	destroyPassedRows(){ //Se eliminan las filas que ya no se ven en cámara
		var row_num = Math.floor(this.px_offset / this.CONFIG.tile);
		for(var ty = 0; ty < row_num; ty++){
			for(var tx = 0; tx < this.cols; tx++){
				if(this.objects.walls[ty][tx].spr){
					this.objects.walls[ty][tx].spr.destroy();
				}
			}
		}

		for(var i = this.objects.monsters.length - 1; i >= 0; i--){
			if(this.objects.monsters[i].y <= this.ctx.cameras.main.scrollY){
				this.objects.monsters[i].destroy(); //Se borra el sprite
				this.objects.monsters.splice(i, 1); //Se elimina del array
			}
		}

	}

	saveHeight(){
		this.height = this.objects.walls.length * this.CONFIG.tile;
	}

	generateWalls(){
		var walls = [];
		for (var ty = 0; ty < 1.5 * this.rows; ty++){
			//En las 7 primeras filas de la primera sala no se generarán paredes
			//Se generan paredes cada 3 filas
			if (this.objects.walls.length + ty >= 8 && (ty + 1) % 3 === 0){
				walls.push(this.generateWallRow());
			}
			else {
				walls.push(this.generateEmptyRow(ty));
			}
		}
		return walls;
	}

	generateEmptyRow(){
		var row = [];
		//Siempre tiene que haber menos paredes que columnas
		for (var tx = 0; tx < this.cols; tx++){
			row.push({
				tx: 	 tx,
				is_wall: false
			});
		}
		return row;
	}

	generateWallRow(){ //Se genera una fila de paredes y después creamos entre 1 y 2 huecos

		var gaps = [];

		for (var i = 0; i < this.helper.getRandInt(1, 2); i++){ //Se generan entre 1 y 2 huecos
			gaps.push({
				idx: 	i,
				width: 	2
			});
		}

		var min = 1;
		var max = this.cols - gaps[0].width - 1;
		var tx = this.helper.getRandInt(min, max);

		gaps[0] = this.buildGap(tx, gaps[0].width);

		if (gaps[1]){

			tx = this.helper.getRandInt(min, max);

			while(gaps[0].taken.indexOf(tx) >= 0){
				tx = this.helper.getRandInt(min, max);
			}

			gaps[1] = this.buildGap(tx, gaps[1].width);

		}

		return this.buildRow(gaps);

	}

	buildGap(tx, width){ //Se crean los huecos de las paredes

		var gap = {
			tx: tx,
			width: width
		};

		gap.empty = [];

		for(var i = 0; i < width; i++){
			gap.empty.push(tx + i);
		}

		gap.taken = [];

		for (var i = -2; i < width + 2; i++){
			gap.taken.push(tx + i);
		}

		return gap;

	}

	buildRow(gaps){

		var row = [];

		for (var tx = 0; tx < this.cols; tx++){ //Se crean paredes en todos los bloques
			row.push({
				tx: 	 tx,
				is_wall: true
			});
		}

		//Borramos las paredes en los bloques donde haya huecos
		gaps.forEach((el) => {

			for (var tx = el.tx; tx < el.tx + el.width; tx++){

				if(row[tx]){
					row[tx].is_wall = false;
				}

			}

		}, this);

		return row;

	}

	createWalls(walls){ //Se crean las paredes

		var x, y, spr;

		for(var ty = 0; ty < walls.length; ty++){

			for (var tx = 0; tx < walls[ty].length; tx++){

				x = (tx * this.CONFIG.tile) + this.CONFIG.map_offset;
				y = (ty + this.objects.walls.length) * this.CONFIG.tile;

				if(walls[ty][tx].is_wall){ //Dibuja el sprite de las paredes

					spr = this.ctx.add.sprite(x, y, 'wall');
					spr.setOrigin(0);
					spr.setDepth(this.DEPTH.wall);

					walls[ty][tx].spr = spr;

				}
			}
		}

		return walls;

	}

	createFloor(){ //Se crea el suelo
		var x, y, spr;
		//Hacemos que el mapa sea más grande que lo que ve la cámara para asegurarnos de que cuando avance exista ya mazmorra creada
		var cols = this.cols;
		var rows = this.rows + 1;
		var floor = [];

		for (var ty = 0; ty < rows; ty++){

			floor[ty] = [];

			for(var tx = 0; tx < cols; tx++){

				x = (tx * this.CONFIG.tile) + this.CONFIG.map_offset;
				y = (ty * this.CONFIG.tile);
				spr = this.ctx.add.sprite(x, y, 'tileset');
				spr.setOrigin(0);
				spr.setDepth(this.DEPTH.floor);

				floor[ty][tx] = spr;
			}
		}
		this.objects.floor = floor;
	}

	drawOverlay(){ //Dibujamos el techo que persigue al personaje

		var x, y, spr;
		var ty = 0;
		var depth = this.DEPTH.overlay;
		var overlay = [];

		for (var tx = 0; tx < this.cols + 2; tx++){

			x = tx * this.CONFIG.tile - this.CONFIG.tile + 1;
			y = ty * this.CONFIG.tile + 8;
			var spr = this.ctx.add.sprite(x, y, 'roof'); //Dibujamos final del mapa
			//this.startNewAn('fire');
			
			spr.setOrigin(0);
			spr.setDepth(depth);
			spr.setScrollFactor(0);

			overlay.push(spr);

		}

		this.objects.overlay = overlay;

	}

	scrollFloor(){ //Controla el avance de la cámara y llama a las funciones encargadas de eliminar las filas que ya se han pasado y de crear las nuevas 
		
		var offset = this.ctx.cameras.main.scrollY - this.objects.floor[0][0].y;

		if (offset >= this.CONFIG.tile){
			this.destroyFloorRow();
			this.newFloorRow();
		}

	}

	destroyFloorRow(){ //Borramos las filas de suelo que ya no se ven en la cámara
		for (var tx = 0; tx < this.objects.floor[0].length; tx++){
			this.objects.floor[0][tx].destroy();
		}
		this.objects.floor.splice(0,1);
	}

	newFloorRow(){ //Juntamos las nuevas filas al mapa

		var x, spr;
		var ty = this.objects.floor.length;
		var y = this.objects.floor[ty - 1][0].y + this.CONFIG.tile;

		this.objects.floor.push([]);

		for(var tx = 0; tx < this.cols; tx++){

				x = (tx * this.CONFIG.tile) + this.CONFIG.map_offset;
				spr = this.ctx.add.sprite(x, y, 'tileset');
				spr.setOrigin(0);
				spr.setDepth(this.DEPTH.floor);

				this.objects.floor[ty][tx] = spr;
			}

	}

	checkTileBlocked(tx, ty){ //Comprobamos si el personaje está intentando acceder a un bloque ocupado

		if(typeof tx === 'object'){
			ty = tx.ty;
			tx = tx.tx;
		}

		if(typeof this.objects.walls[ty] === 'undefined'){ //Comprobamos si se está intentando acceder a un bloque fuera del mapa
			return true;
		}

		else if(typeof this.objects.walls[ty][tx] === 'undefined'){
			return true;
		}

		else if(typeof this.objects.walls[ty][tx].is_wall){ //Comprobamos que sea un muro
			return this.objects.walls[ty][tx].is_wall;
		}

	}

	checkTileBlockedMonster(tx, ty){ //Comprobamos si el monstruo está intentando acceder a un bloque ocupado

		if(typeof tx === 'object'){
			ty = tx.ty;
			tx = tx.tx;
		}

		if(typeof this.objects.walls[ty][tx] === 'player'){
			alert('Player');
		}

		if(typeof this.objects.walls[ty] === 'undefined'){ //Comprobamos si se está intentando acceder a un bloque fuera del mapa
			return true;
		}

		else if(typeof this.objects.walls[ty][tx] === 'undefined'){
			return true;
		}

		else if(typeof this.objects.walls[ty][tx].is_wall){ //Comprobamos que sea un muro
			return this.objects.walls[ty][tx].is_wall;
		}

	}

	checkPositPlayer(playerX, playerY){ //Comprobamos si el personaje está intentando acceder a un bloque en el que se encuentra un monstruo
		this.playerX = playerX;
		this.playerY = playerY;
		this.objects.walls[playerY][playerX - 1] = 'player';
		setTimeout(() => {  this.objects.walls[playerY][playerX - 1] = 'undefined' }, 500);
	}

	checkPositMonster(monsterX, monsterY){ //Comprobamos si el personaje está intentando acceder a un bloque ocupado
		var ty = this.objects.floor.length;
		var y = this.objects.floor[ty - 1][0].y / 32;

		this.monsterX = monsterX;
		this.monsterY = monsterY;

		if(y >= monsterY){
			if(this.objects.walls[monsterY][monsterX - 1] === 'player'){
				this.playerHit();
			}
		}
	}

	playerHit(){ //Comprueba las colisiones entre los monstruos y el personaje

		if(this.executing != true){
			this.executing = true; //Se utiliza esta condición para evitar que se ejecute muchas veces seguidas mientras dura la colisión
			setTimeout(() => {  this.executing = false}, 2000);
			this.checkHit();
		}

	}

	checkHit(){ //Devuelve si se ha producido colisión entre el personaje y un monstruo
		if(this.executing === true){
			return true;
		}
		else
			return false;
	}

	checkPositPowerUp(powerUpX, powerUpY){ //Controla la posición del aliado que cura

		var ty = this.objects.floor.length;
		var y = this.objects.floor[ty - 1][0].y / 32;

		this.powerUpX = powerUpX;
		this.powerUpY = powerUpY;

		if(y >= powerUpY && powerUpY != 'undefined'){
			if(this.objects.walls[powerUpY][powerUpX - 1] === 'player'){
				this.canHeal = true;
				//setTimeout(() => {  this.canHeal = false}, 2000);
				this.powerUpHit();
			}
		}

	}

	powerUpHit(){ //Controla si se ha producido colisión entre el personaje y el aliado que cura
		if(this.canHeal === true){
			setTimeout(() => {  this.canHeal = false; }, 1000);
			return true;
		}
		else{
			return false;
		}
	}

	checkPositGem(gemX, gemY){ //Controla la posición del aliado que da una gema que aumenta la puntuación de la partida

		var ty = this.objects.floor.length;
		var y = this.objects.floor[ty - 1][0].y / 32;

		this.gemX = gemX;
		this.gemY = gemY;

		if(y >= gemY){
			if(this.objects.walls[gemY][gemX - 1] === 'player'){
				this.canGiveGem = true;
				this.gemHit();
			}
		}

	}

	gemHit(){ //Controla si se ha producido colisión entre el personaje y el aliado de la gema
		if(this.canGiveGem === true){
			setTimeout(() => {  this.canGiveGem = false; }, 1000);
			return true;
		}
		else{
			return false;
		}
	}

}