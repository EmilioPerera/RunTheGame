class Controls extends Phaser.Scene{

	constructor(){
		super({key: 'Controls', active: false});
	}

	init(data){

		this.score = data.score;

		this.CONFIG = this.sys.game.CONFIG;

		this.helper = new Helper();

	}

	create(){ //Pantalla en la que se muestran los controles del juego

		this.add.image(180, 330, 'tower')

		var x = this.CONFIG.tile;
		var w = this.CONFIG.width - 2*x;

		var h = 560;
		var y = 40;

		this.background = this.add.graphics({x: x, y: y});
		this.background.fillStyle('0x27063C', 0.9);
		this.background.fillRoundedRect(0, 0, w, h, 15);

		this.title = new Text(
			this, x + 0.5*w, 100, 'Controles', 'title'
		);

		this.controls = new Text(
			this, x + 0.5*w, 310, 
			'Mov. Izquierda:      A o <-\n\nMov. Derecha:       D o ->\n\nPausa:               P\n\nReiniciar partida:   R\n\nVolver al menu:     Esc\n\nMusic on/off:       M', 'controls'
		);

		this.createAllButtons(x, y, w, h);

	}

	createAllButtons(x, y, w, h){ //Se crean los botones de la pantalla de controles

		this.btn_menu = this.createButton(
			x + 0.25*w, y + 0.85*h, this.clickMenuCont
		);

		this.lbl_menu = new Text(
			this,
			this.btn_menu.getData('centerX'),
			this.btn_menu.getData('centerY'),
			'Menu',
			'standard'
		);

		this.btn_again = this.createButton(
			x + 0.75*w, y + 0.85*h, this.clickGoPlayCont
		);

		this.lbl_again = new Text(
			this,
			this.btn_again.getData('centerX'),
			this.btn_again.getData('centerY'),
			'Play',
			'standard'
		);

	}

	createButton(centerX, centerY, callback){

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

	clickMenuCont(){
		this.events.emit('clickMenuCont');
	}

	clickGoPlayCont(){
		this.events.emit('clickGoPlayCont');
	}

}