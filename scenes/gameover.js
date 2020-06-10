class GameOver extends Phaser.Scene{

	constructor(){
		super({key: 'GameOver', active: false});
	}

	init(data){

		this.score = data.score;

		this.CONFIG = this.sys.game.CONFIG;

		this.helper = new Helper();

	}

	create(){ //Se crea la pantalla de fin de la partida

		var x = this.CONFIG.tile;
		var w = this.CONFIG.width - 2*x;

		var h = 296;
		var y = 148;

		this.background = this.add.graphics({x: x, y: y});
		this.background.fillStyle('0x27063C', 0.6);
		this.background.fillRoundedRect(0, 0, w, h, 15);

		this.title = new Text(
			this, x + 0.5*w, 207, 'Game Over', 'title'
		);

		this.txt_score = new Text(
			this, x + 0.5*w, y + 0.5*h, 'Score: ' + this.score, 'standard'
		);

		this.createAllButtons(x, y, w, h);

	}

	createAllButtons(x, y, w, h){ //Se crean los botones de volver al menú y de volver a jugar

		this.btn_menu = this.createButton(
			x + 0.25*w, y + 0.85*h, this.clickMenu
		);

		this.lbl_menu = new Text(
			this,
			this.btn_menu.getData('centerX'),
			this.btn_menu.getData('centerY'),
			'Menu',
			'standard'
		);

		this.btn_again = this.createButton(
			x + 0.75*w, y + 0.85*h, this.clickTryAgain
		);

		this.lbl_again = new Text(
			this,
			this.btn_again.getData('centerX'),
			this.btn_again.getData('centerY'),
			'Try Again',
			'standard'
		);

	}

	createButton(centerX, centerY, callback){ //Se dibujan los botones

		var w = 4.5 * this.CONFIG.tile;
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

	clickMenu(){
		this.events.emit('clickMenu');
	}

	clickTryAgain(){
		this.events.emit('clickTryAgain');
	}

}