const App = function(){

	'use strict';
	this.VERSION = '0.0.1';
	this.IS_DEV = true;

};

App.prototype.start = function(){
	
	'use strict';

	//Scenes
	var scenes = [];
	scenes.push(Boot);
	scenes.push(Preload);
	scenes.push(Menu);
  	scenes.push(Play);
  	scenes.push(GameOver);
  	scenes.push(Controls);

	//Game config
	const config = {
		type: 				   	Phaser.AUTO,
		parent: 			   	'phaser-app',
		title: 				   	'Run!',
		physics:                {default: "arcade", arcade: {debug: true}}, 
		url: 				    '', //Poner enlace cuando esté subido a GitHub
		width: 				   	360,
		height: 			   	640,
		scene: 				   	scenes,
		pixelArt: 			 	true,
		backgroundColor: 		'0x000000' //Fondo de pantalla PreloadScreen
	};

	//Create game app
	var game = new Phaser.Game(config);

	//Globals
	game.IS_DEV 	= this.IS_DEV;
	game.VERSION 	= this.VERSION;
	game.URL		= "";
	game.CONFIG		= {
		width: 		     config.width,
		height: 	     config.height,
		centerX: 	     Math.round(0.5 * config.width),
		centerY: 	     Math.round(0.5 * config.height),
		tile: 		     32,
    	map_offset :   	 4
	}

	//Sound
	game.sound_on 	= true;

};