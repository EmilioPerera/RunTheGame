class Play extends Phaser.Scene{

	constructor(){
		super({key: 'Play', active: false});
	}

	init(data){
		
		this.menu 		= new Menu();
		this.CONFIG 	= this.sys.game.CONFIG;
		this.sound_on 	= data.sound_on;
		this.game 		= this.sys.game;

		this.DEPTH = { //Se establece la profundidad de los sprites
			floor: 		0,
			wall: 		1,
			pickup: 	2,
			monster: 	3,
			player: 	4,
			overlay: 	5,
			ui: 		6,
			menu: 		7
		}

		this.helper 	= new Helper();
		this.generator 	= new Generator(this);

		//Flags
		this.allow_input 	= false;
		this.is_pause 		= false;
		this.is_gameover 	= false;

		//Controles
		this.is_holding = {
			left: 		false,
			right: 		false,
			direction: 	false
		}

		//Cámara
		this.cam_speed = {
			base: 		1,
			current: 	1,
			max: 		2
		};

		this.cam_speed.current = 1;
		this.addScore = 0;
		this.currentScore = 0;

	}

	preload(){
		this.load.audio('music2', 'scenes/audio/music2.mp3');
		this.load.audio('sound1', 'scenes/audio/gameover.wav');
		this.load.audio('sound2', 'scenes/audio/gameover2.wav');
		this.load.audio('hurt1', 'scenes/audio/hurt.wav');
		this.load.audio('hurt2', 'scenes/audio/hurt.mp3');
		this.load.audio('heal', 'scenes/audio/heal.wav');
		this.load.audio('gem', 'scenes/audio/gem.wav');
	}

	create(){

		//Mazmorra
		this.generator.setup();

		//Player
		this.createPlayer();

		//Enemigos
		this.createEnemies();

		//Objetos
		this.createObjects();

		//Controles
		this.createKeyboardInput();

		//UI
		this.createUI();
		this.updateUI();
		this.createPauseScreen();

		//Música
		this.gameMusic 				= this.sound.add('music2', {volume: 0.15});
		this.gameMusic.loop 		= true;
		this.gameOverSoundEffect 	= this.sound.add('sound1', {volume: 0.2});
		this.gameOverSoundEffect2 	= this.sound.add('sound2', {volume: 0.4});
		this.hurtSoundEffect 		= this.sound.add('hurt1', {volume: 0.5});
		this.hurtSoundEffect2 		= this.sound.add('hurt2', {volume: 0.5});
		this.healSoundEffect		= this.sound.add('heal', {volume: 0.5});
		this.gemSoundEffect			= this.sound.add('gem', {volume: 0.5});

		if(this.sound_on === true)
			this.gameMusic.play();

		//Comienzo de la partida
		this.allow_input 	= true;
		this.is_pause 		= false;
		this.is_gameover 	= false;

	}

	update(){

		//Movimiento de la cámara
		this.updateCamera();

		//Crear mazmorra 
		this.generator.update();

		if(this.generator.checkHit() === true && this.executing != true){ //Controla cuando el peronsaje recibe un golpe
			this.executing = true;
			setTimeout(() => {  this.executing = false}, 2000);
			this.hurtSoundEffect.play();
			this.playerHurtScreen();
			this.player.health.current--;
			this.updateUI();
		}

		if(this.player.health.current === 0){ //Lanza el final de la partida
			this.player.gameOver();
			this.triggerGameOver();
		}

		if(this.generator.powerUpHit() === true && this.executingObj != true){ //Controla las colisiones del personaje con el aliado que cura
			this.executingObj = true;
			setTimeout(() => {  this.executingObj = false}, 2000);
			if(this.player.health.current < 3){
				this.healSoundEffect.play();
				this.player.health.current++;
				this.updateUI();
			}
		}

		else if(this.generator.gemHit() === true && this.executingObj2 != true){ //Controla las colisiones del personaje con el aliado que da gemas
			this.executingObj2 = true;
			setTimeout(() => {  this.executingObj2 = false}, 3000);
			this.gemSoundEffect.play();
			this.addScore = this.addScore + 50;
		}

		//Movimiento del personaje
		this.player.update(this.is_holding.direction);

		//Aceleramos el movimiento del personaje y de la cámara a medida que el personaje avanza por la mazmorra
		if(this.player.ty === 30){
			this.player.speed.current 	= 2.3;
			this.cam_speed.current 		= 1.2;
		}
		if(this.player.ty === 70){
			this.player.speed.current 	= 2.6;
			this.cam_speed.current 		= 1.4;
		}
		if(this.player.ty === 110){
			this.player.speed.current 	= 2.85;
			this.cam_speed.current 		= 1.6;
		}
		if(this.player.ty === 150){
			this.player.speed.current 	= 3.1;
			this.cam_speed.current 		= 1.8;
		}
		if(this.player.ty === 200){
			this.player.speed.current 	= 3.25;
			this.cam_speed.current 		= 2;
		}

		//Control de la interfaz
		this.score = this.player.ty;
		this.updateGameScore();

		//Comprueba si se ha perdido la partida
		if(this.player.states.defeated){
			this.playerHurtScreen();
			this.triggerGameOver();
			return;
		}

	}

	playerHurtScreen(){ //Imagen para mostrar visualmente el daño recibido por el personaje

		var x = this.CONFIG.tile;
		var y = 30;

		this.img = this.add.graphics({x: x - 30, y: y});
		this.img.fillStyle('0xD51300', 0.3);
		this.img.fillRoundedRect(0, 0, 360, 640, 15);
		this.img.setScrollFactor(0);

		setTimeout(() => {
			this.img.destroy();
		}, 200);

	}

	createPlayer(){

		var center = this.helper.getTileCenter(
			5, 1, this.CONFIG.tile
		);

		this.player = new Player(
			this,
			center.x,
			center.y,
			'hero'
		);

		this.player.setDepth(this.DEPTH.player);

		this.player.startMoving();

	}

	createEnemies(){ //Se crean los enemigos, aparecerán con mayor frecuencia cuanto más avance el personaje

		var numPosit 	= 0;
		var numMonster 	= 0;
		this.monster = [];

		//Primera oleada (Hasta bloque 90)

		for(var i = 1; i < 10; i++){

			numPosit = this.helper.getRandInt(0,1);

			var center = this.helper.getTileCenter(
				this.helper.getRandInt(5,8), i*9 + numPosit, this.CONFIG.tile
			);

			numMonster = this.helper.getRandInt(1,3);

			if(numMonster === 1){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'skeleton'
				);
			}
			else if(numMonster === 2){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'ghost'
				);
			}
			else if(numMonster === 3){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'darkSlime'
				);
			}

			this.monster[i].setDepth(this.DEPTH.monster);

			this.monster[i].enemyPatrol();

		}

		//Segunda oleada (Hasta bloque 150)
		//A partir de la segunda oleada se añaden dos nuevos tipos de enemigos
		
		for(var i = 15; i < 25; i++){

			numPosit = this.helper.getRandInt(0,1);

			var center = this.helper.getTileCenter(
				this.helper.getRandInt(5,8), i*6 + numPosit, this.CONFIG.tile
			);

			var center = this.helper.getTileCenter(
				this.helper.getRandInt(5,8), i*6 + 1, this.CONFIG.tile
			);

			numMonster = this.helper.getRandInt(1,5);
			if(numMonster === 1){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'skeleton'
				);
			}
			else if(numMonster === 2){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'ghost'
				);
			}
			else if(numMonster === 3){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'darkSlime'
				);
			}
			else if(numMonster === 4){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'darkWizard'
				);
			}
			else if(numMonster === 5){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'pumpkin'
				);
			}

			this.monster[i].setDepth(this.DEPTH.monster);

			this.monster[i].enemyPatrol();

		}

		//Tercera oleada (Hasta bloque 450)
		
		for(var i = 50; i < 150; i++){

			numPosit = this.helper.getRandInt(0,1);

			var center = this.helper.getTileCenter(
				this.helper.getRandInt(5,8), i*3 + numPosit, this.CONFIG.tile
			);

			numMonster = this.helper.getRandInt(1,5);
			if(numMonster === 1){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'skeleton'
				);
			}
			else if(numMonster === 2){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'ghost'
				);
			}
			else if(numMonster === 3){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'darkSlime'
				);
			}
			else if(numMonster === 4){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'darkWizard'
				);
			}
			else if(numMonster === 5){
				this.monster[i] = new Monster(
					this,
					center.x,
					center.y,
					'pumpkin'
				);
			}

			this.monster[i].setDepth(this.DEPTH.monster);

			this.monster[i].enemyPatrol();

		}

	}

	createObjects(){ //Se generan los objetos (aliados)

		var numObj 	= 1;
		var numMonster 	= 0;
		var spr;
		this.gems = [];
		this.medkits = []

		for(var i = 1; i < 15; i++){

			var center = this.helper.getTileCenter(
				this.helper.getRandInt(3,8), i*30, this.CONFIG.tile
			);

			//numObj = this.helper.getRandInt(1,2); //Si quisiéramos que se generaran al azar
			//Se va generando cada vez 1, primero un mago, después el hombre que te da una gema que aumenta la puntuación de la partida

			if(numObj === 1){
				this.medkits[i] = new PowerUps(
					this,
					center.x,
					center.y
				);
				this.medkits[i].checkPowerUp();
				this.medkits[i] = this.add.sprite(center.x, center.y, 'wizard');
				this.medkits[i].setDepth(this.DEPTH.pickup);
				numObj = 2;
			}
			else if(numObj === 2){
				this.gems[i] = new Gems(
					this,
					center.x,
					center.y
				);
				this.gems[i].checkGems();
				this.gems[i] = this.add.sprite(center.x, center.y, 'man');
				this.gems[i].setDepth(this.DEPTH.pickup);
				numObj = 1;
			}

		}

	}

	destroyObjects(){ //Se eliminan los objetos
		for(var i = 1; i < 15; i++){
			if(this.medkits[i]){
				this.medkits[i].destroy();
			}
			else{
				this.gems[i].destroy();
			}
		}
	}

	triggerGameOver(){ //Fin de la partida

		if(this.is_gameover) return;

		this.is_gameover = true;

		this.cam_speed.current = 0;

		this.gameMusic.stop();
		this.gameOverSoundEffect.play();
		this.gameOverSoundEffect2.play();

		this.time.addEvent({

			delay: 			1500,
			callback: 		this.showEndGame,
			callbackScope: 	this

		});

	}

	showEndGame(){ //Pantalla de fin de la partida

		this.txt_score.setVisible(false); //Ponemos en invisible los elementos de la interfaz

		this.player.health.current = 0;

		this.updateUI();

		this.scene.launch('GameOver', {score: this.currentScore});
		var panel = this.scene.get('GameOver');

		panel.events.on('clickMenu', this.handleGoMenu, this);
		panel.events.on('clickTryAgain', this.handleTryAgain, this);

	}

	closeEndGame(){
		this.scene.stop('GameOver');
	}

	handleGoMenu(){
		this.closeEndGame();
		this.goMenu();
	}

	handleTryAgain(){
		this.closeEndGame();
		this.restartGame();
	}

	updateCamera(){ //Control de la cámara

		this.cameras.main.setScroll(
			0, //Sólo se mueve verticalmente así que el eje X de la cámara permanece siempre a 0
			this.cameras.main.scrollY + this.cam_speed.current
		);

		//La cámara sigue al personaje cuando éste llega a la mitad de la pantalla
		var centerY = this.cameras.main.scrollY + 0.5 * this.cameras.main.height;

		if(this.player.y >= centerY){
			this.cameras.main.setScroll(
				0,
				this.player.y - 0.5 * this.cameras.main.height
			);
		}

	}

	setCamSpeed(){

		this.cam_speed.base = speed;
		this.cam_speed.current = speed;

		this.cam_speed.current = Math.min(
			this.cam_speed.current,
			this.cam_speed.max
		);

		this.cam_speed.current = Math.max(
			this.cam_speed.current,
			0
		);

	}

	createKeyboardInput(){ //Controles

		function handleKeyDown(e){

			switch (e.keyCode){
				case 65: //A
					this.holdLeft();
				break;
				case 68: //D
					this.holdRight();
				break;
				case 37: //<-
					this.holdLeft();
				break;
				case 39: //->
					this.holdRight();
				break;
				case 80: //P
					this.clickPause();
				break;
				case 27: //Esc
					this.goMenu();
				break;
				case 77: //M
					this.controlMusic();
				break;
				case 82: //R
					this.restartGame();
				break;
			}

		}

		function handleKeyUp(e){

			switch (e.keyCode){
				case 65: //A
					this.releaseLeft();
				break;
				case 68: //D
					this.releaseRight();
				break;
				case 37: //<-
					this.releaseLeft();
				break;
				case 39: //->
					this.releaseRight();
				break;
			}

		}

		this.input.keyboard.on('keydown', handleKeyDown, this);
		this.input.keyboard.on('keyup', handleKeyUp, this);

	}

	holdLeft(){

		if(!this.allow_input) return;
		if(this.is_pause || this.is_gameover) return;

		this.is_holding.left 		= true;
		this.is_holding.direction 	= 'left';

	}

	holdRight(){

		if(!this.allow_input) return;
		if(this.is_pause || this.is_gameover) return;

		this.is_holding.right 		= true;
		this.is_holding.direction 	= 'right';

	}

	releaseLeft(){

		this.is_holding.left = false;
		if (this.is_holding.right){
			this.is_holding.direction = 'right';
		}
		else {
			this.is_holding.direction = false;
		}

	}

	releaseRight(){

		this.is_holding.right = false;
		if (this.is_holding.left){
			this.is_holding.direction = 'left';
		}
		else {
			this.is_holding.direction = false;
		}

	}

	createUI(){ //Interfaz de usuario

		this.bg_top = this.createUIBar(0, -22);
		this.bg_bot = this.createUIBar(
			0, this.CONFIG.height - this.CONFIG.tile
		);

		var btnMenu;

		this.txt_score = new Text( //Texto puntuación partida
			this,
			this.bg_bot.getData('centerX') - 90,
			this.bg_bot.getData('centerY'),
			'Score: 0',
			'score'
		);

		this.txt_score.setDepth(this.DEPTH.ui);
		this.txt_score.setScrollFactor(0);

	}

	createUIBar(x, y){ //Barras de la UI

		var w = this.CONFIG.width;
		var h = this.CONFIG.tile;

		var bar = this.add.graphics({x: x, y: y});

		bar.fillStyle('0x000000', 1);
		bar.fillRect(0, 0, w, h);
		bar.setDepth(this.DEPTH.ui);
		bar.setScrollFactor(0);

		bar.setDataEnabled();
		bar.setData('centerX', x + 0.5 * w);
		bar.setData('centerY', y + 0.5 * h);

		return bar;

	}

	updateGameScore(){ //Se actualiza la puntuación de la partida
		if (!this.player) return;
		this.currentScore = this.score + this.addScore;
		this.txt_score.setText('Score: ' + this.currentScore);
	}

	updateUI(){ //Se actualiza la interfaz de usuario

		if (!this.player) return;

		var icon;
		var aux = this.player.health.total - this.player.health.current; 
		var y = this.bg_bot.getData('centerY');
		var step = this.CONFIG.tile;

		if(this.player.health.current === 3){

			for(var i = 0; i < this.player.health.current; i++){

				icon = this.add.sprite(245 + i * step, y, 'icon1'); //Salud personaje
				icon.setDepth(this.DEPTH.menu);
				icon.setScrollFactor(0);

			}
		}

		else if(this.player.health.current === 2){

			for(var i = 0; i < this.player.health.current; i++){

				icon = this.add.sprite(245 + i * step, y, 'icon1');
				icon.setDepth(this.DEPTH.menu);
				icon.setScrollFactor(0);

			}

			for(var i = aux + 1; i < this.player.health.total; i++){

				icon = this.add.sprite(245 + i * step, y, 'icon2');
				icon.setDepth(this.DEPTH.menu);
				icon.setScrollFactor(0);

			}

		}

		else if(this.player.health.current === 1){

			for(var i = 0; i < this.player.health.current; i++){

				icon = this.add.sprite(245 + i * step, y, 'icon1');
				icon.setDepth(this.DEPTH.menu);
				icon.setScrollFactor(0);

			}

			for(var i = aux - 1; i < this.player.health.total; i++){

				icon = this.add.sprite(245 + i * step, y, 'icon2');
				icon.setDepth(this.DEPTH.menu);
				icon.setScrollFactor(0);

			}

		}

		else if(this.player.health.current === 0){

			for(var i = 0; i < this.player.health.total; i++){

				icon = this.add.sprite(245 + i * step, y, 'icon2');
				icon.setDepth(this.DEPTH.menu);
				icon.setScrollFactor(0);

			}

		}

	}

	controlMusic(){ //Permite activar y desactivar la música del juego
		if(this.sound_on === true){
			this.sound.stopAll();
			this.sound_on = false;
		}
		else if(this.sound_on === false){
			this.gameMusic.play();
			this.sound_on = true;
		}
	}

	createPauseScreen(){ //Se crea la pantalla de pausa

		this.veil = this.add.graphics({x: 0, y: 0});
		this.veil.fillStyle('0x000000', 0.3);
		this.veil.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
		this.veil.setDepth(this.DEPTH.ui);
		this.veil.setScrollFactor(0);

		this.txt_pause = new Text(
			this, this.CONFIG.centerX, this.CONFIG.centerY - 32, 'Pause', 'title'
		);
		this.txt_pause.setDepth(this.DEPTH.ui);
		this.txt_pause.setScrollFactor(0);

		this.togglePauseScreen(false);

	}

	togglePauseScreen(is_visible){
		this.veil.setVisible(is_visible);
		this.txt_pause.setVisible(is_visible);
	}

	clickPause(){

		if(!this.allow_input) return;
		if(this.is_gameover) return;

		this.is_pause = !this.is_pause;
		this.togglePauseScreen(this.is_pause);

		if(this.is_pause){
			this.startPause();
		}
		else{
			this.stopPause();
		}

	}

	startPause(){ //Inicia la pantalla de pausa
		this.camAux = this.cam_speed.current;
		if(this.player.states.walk){
			this.player.stopMoving();
			this.cam_speed.current = 0;
			//this.scene.pause();
		}
	}

	stopPause(){
		this.player.startMoving();
		this.cam_speed.current = this.camAux;
	}

	checkMusic(){ //Comprueba si la música del juego está activada o no
		this.firstGame = false;
		if(this.sound_on === true){
			return true;
		}
		else{
			return false;
		}
	}

	goMenu(){ //Lanza la pantalla del menú
		this.destroyObjects();
		this.scene.stop();
		this.sound.stopAll();
		this.cameFromPlay = true;
		this.scene.start('Menu', {sound_on: this.checkMusic(), firstGame: false, cameFromPlay: true});
	}

	restartGame(){ //Reinicia la partida
		this.destroyObjects();
		this.sound.stopAll();
		this.scene.stop();
		this.cameFromPlay = true;
		this.scene.restart({sound_on: this.checkMusic(), firstGame: true, cameFromPlay: true});
	}

}