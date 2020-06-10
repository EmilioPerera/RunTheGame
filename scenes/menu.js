class Menu extends Phaser.Scene {

	constructor(){
		super({key: 'Menu', active: false});
	}

	init(data){
		this.CONFIG 		= this.sys.game.CONFIG;
		this.sound_on 		= this.sys.game.sound_on;
		this.soundOn 		= data.sound_on;
		this.firstGame 		= data.firstGame;
		this.resetScene 	= data.resetScene;
		this.sound_on_reset = data.sound_on_reset;
		this.needMusic 		= data.needMusic;
		this.cameFromPlay 	= data.cameFromPlay;
	}

	preload(){ //Se carga el fondo de pantalla del menú
		this.load.image('tower', 'scenes/bg/tower.png');
		this.load.image('controls', 'scenes/bg/controls.png');
		this.load.audio('music1', 'scenes/audio/music1.mp3');
	}

	create(){

		this.add.image(180, 330, 'tower');
		if(this.firstGame === false){
			this.sound_on = this.soundOn;
		}

		if(this.resetScene === true){
			this.resetScene = false;
			this.sound_on = this.sound_on_reset;
		}

		//Game title
		this.title = new Text(
			this,
			this.CONFIG.centerX,
			75,
			'Run!',
			'title'
		);

		this.menuMusic = this.sound.add('music1', {volume: 0.3});
		this.menuMusic.loop = true;

		if(this.sound_on && this.controlMusicUsed != true && this.needMusic != false){ //Comprueba si es necesario reproducir la música
			this.menuMusic.play();
		}

		if(this.sound_on && this.cameFromPlay === true){ //Comprueba si tiene que reproducirse la música cuando viene desde Play
			this.menuMusic.play();
		}

        var x = this.CONFIG.tile;
		var w = this.CONFIG.width - 2*x;

		var h = 560;
		var y = 40;

		this.createAllButtons(x, y, w, h);

	}

	createAllButtons(x, y, w, h){ //Se crean los botones del menú

		this.btn_play = this.createButton(
			x + 0.5*w, y + 0.3*h, this.goPlay
		);

		this.lbl_play = new Text(
			this,
			this.btn_play.getData('centerX'),
			this.btn_play.getData('centerY'),
			'Play',
			'standard'
		);

		this.btn_controls = this.createButton(
			x + 0.5*w, y + 0.55*h, this.showControls
		);

		this.lbl_controls = new Text(
			this,
			this.btn_controls.getData('centerX'),
			this.btn_controls.getData('centerY'),
			'Controls',
			'standard'
		);

		this.btn_music = this.createButton(
			x + 0.5*w, y + 0.8*h, this.controlMusic
		);

		this.lbl_music = new Text(
			this,
			this.btn_music.getData('centerX'),
			this.btn_music.getData('centerY'),
			'Music on/off',
			'standard'
		);

	}

	createButton(centerX, centerY, callback){

		var w = 6.25 * this.CONFIG.tile;
		var h = 2 * this.CONFIG.tile;
		var r = 20;

		var x = centerX - 0.5*w;
		var y = centerY - 0.5*h;

		var btn = this.add.graphics({x: x, y: y});

		btn.fillStyle('0x01052B', 0.7);
		btn.fillRoundedRect(0, 0, w, h);

		btn.setDataEnabled();
		btn.setData('centerX', centerX);
		btn.setData('centerY', centerY);

		var hit_area = new Phaser.Geom.Rectangle(0, 0, w, h);
		btn.setInteractive(hit_area, Phaser.Geom.Rectangle.Contains);

		btn.clickBtn = () =>{
			btn.clear();
			btn.fillStyle('0x000000', 0.5);
			btn.fillRoundedRect(0, 0, w, h, r);
		}

		btn.releaseBtn = () =>{
			btn.clear();
			btn.fillStyle('0x01052B', 0.7);
			btn.fillRoundedRect(0, 0, w, h, r);
		}

		btn.on('pointerup', callback, this);
		btn.on('pointerdown', btn.clickBtn, this);
		btn.on('pointerout', btn.releaseBtn, this);

		return btn;

	}

	controlMusic(){ //Pausa y reanuda la música
		if(this.sound_on === true){
			this.sound_on = false;
			this.sound.stopAll();
		}
		else{
			this.sound_on = true;
			this.menuMusic.play();
		}
		this.controlMusicUsed = true; //Variable utilizada para evitar que se reproduzca la música más de una vez
	}
	
	checkMusic(){ //Comprueba si la música del juego está activada o no
		if(this.sound_on === true){
			return true;
		}
		else{
			return false;
		}
	}

	checkNeedMusic(){
		if(this.sound_on === true){
			return false;
		}
		else{
			return true;
		}
	}

	goPlay(){ //Inicia la partida
		this.sound.stopAll();
		this.scene.start('Play', {sound_on: this.checkMusic()});
	}

	showControls(){ //Lanza la pantalla de los controles del juego
		this.scene.start('Controls');
		var panel = this.scene.get('Controls');

		panel.events.on('clickMenuCont', this.handleGoMenuCont, this);
		panel.events.on('clickGoPlayCont', this.handleGoPlayCont, this);
	}

	closeControlsScene(){
		this.scene.stop('Controls');
	}

	closeMenuScene(){
		this.scene.stop('Menu');
	}

	handleGoMenuCont(){
		this.closeControlsScene();
		this.closeMenuScene();
		this.scene.restart({sound_on_reset: this.checkMusic(), resetScene: true, needMusic: this.checkNeedMusic()});
	}

	handleGoPlayCont(){
		this.closeControlsScene();
		this.goPlay();
	}

}