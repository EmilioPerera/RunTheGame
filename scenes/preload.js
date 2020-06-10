class Preload extends Phaser.Scene {

	constructor(){
		super({key: 'Preload', active: false});
	}

	init(){
		//Globals
		this.URL    = this.sys.game.URL;
		this.CONFIG = this.sys.game.CONFIG;
	}

	preload(){

      //Background
      this.bg = this.add.graphics({x: 0, y: 0});
      this.bg.fillStyle('0x27063C', 1);
      this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);

    	//Crea la barra de carga
    	this.createLoadingBar();

    	//Carga de los sprites
    	this.load.setPath(this.URL + 'assets/img');
        this.load.spritesheet('hero', 'hero-walk.png', {frameWidth: 32, frameHeight: 32, endFrame: 2, margin: 0, spacing: 0});
        this.load.spritesheet('hero-walk-left', 'hero-walk-left.png', {frameWidth: 32, frameHeight: 32, endFrame: 2, margin: 0, spacing: 0});
        this.load.spritesheet('hero-walk-right', 'hero-walk-right.png', {frameWidth: 32, frameHeight: 32, endFrame: 2, margin: 0, spacing: 0});
        this.load.spritesheet('bones', 'bones.png', {frameWidth: 32, frameHeight: 32, endFrame: 2, margin: 0, spacing: 0});
        this.load.spritesheet('skeleton', 'enemy1.png', {frameWidth: 32, frameHeight: 32, endFrame: 11, margin: 0, spacing: 0});
        this.load.spritesheet('ghost', 'enemy2.png', {frameWidth: 32, frameHeight: 32, endFrame: 11, margin: 0, spacing: 0});
        this.load.spritesheet('darkSlime', 'enemy3.png', {frameWidth: 32, frameHeight: 32, endFrame: 11, margin: 0, spacing: 0});
        this.load.spritesheet('darkWizard', 'enemy4.png', {frameWidth: 32, frameHeight: 32, endFrame: 11, margin: 0, spacing: 0});
        this.load.spritesheet('pumpkin', 'enemy5.png', {frameWidth: 32, frameHeight: 32, endFrame: 11, margin: 0, spacing: 0});
        this.load.spritesheet('tileset', 'floor2.png', {frameWidth: 32, frameHeight: 32, endFrame: 1, margin: 0, spacing: 0});
        this.load.spritesheet('wall', 'wall2.png', {frameWidth: 32, frameHeight: 32, endFrame: 0, margin: 0, spacing: 0});
        this.load.spritesheet('roof', 'castle1.png', {frameWidth: 38, frameHeight: 32, endFrame: 0, margin: 0, spacing: 0});
        this.load.spritesheet('icon1', 'icon1.png', {frameWidth: 32, frameHeight: 32, endFrame: 0, margin: 0, spacing: 0});
        this.load.spritesheet('icon2', 'icon2.png', {frameWidth: 32, frameHeight: 32, endFrame: 0, margin: 0, spacing: 0});
        this.load.spritesheet('wizard', 'wizard.png', {frameWidth: 32, frameHeight: 32, endFrame: 0, margin: 0, spacing: 0});
        this.load.spritesheet('man', 'man.png', {frameWidth: 32, frameHeight: 32, endFrame: 0, margin: 0, spacing: 0});

	}

	create(){

        //Sprites
        this.createAllAn();

    		//Llamada al menú
    		this.time.addEvent({
            delay: 1000,
            callback: () => {this.scene.start('Menu');},
            callbackScope: this
        });

	}

	createLoadingBar(){

		//Texto (título)
        this.title = new Text(
            this,
            this.CONFIG.centerX, 75,
            'Cargando juego',
            'preload',
            0.5
        );

		//Texto (carga)
        this.txt_progress = new Text(
            this,
            this.CONFIG.centerX,
            this.CONFIG.centerY - 5,
            'Cargando...',
            'preload',
            {x: 0.5, y: 1}
        );

		//Barra de carga
        var x = 10;
        var y = this.CONFIG.centerY + 5;

        this.progress = this.add.graphics({x: x, y: y});
        this.border = this.add.graphics({x: x, y: y});

        this.load.on('progress', this.onProgress, this);

	}

    onProgress(val){ //Se rellena la barra de carga

        var w = this.CONFIG.width - 2 * this.progress.x;
        var h = 36;

        this.progress.clear();
        this.progress.fillStyle('0xFFFFFF', 1);
        this.progress.fillRect(0, 0, w * val, h);

        this.border.clear();
        this.border.lineStyle(4, '0x4D6591', 1);
        this.border.strokeRect(0, 0, w * val, h, 2);

        this.txt_progress.setText(Math.round(val * 100) + '%');
        
    }

    createAllAn(){ //Se cargan las animaciones tanto de los enemigod como del personaje

        //Hero
        this.anims.create({
           key: 'hero-walk',
           frames: this.anims.generateFrameNames('hero', {frames: [1,0,1,2]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'hero-walk-left',
           frames: this.anims.generateFrameNames('hero-walk-left', {frames: [1,0,1,2]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'hero-walk-right',
           frames: this.anims.generateFrameNames('hero-walk-right', {frames: [1,0,1,2]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'bones',
           frames: this.anims.generateFrameNames('bones', {frames: [0,1,2]}),
           repeat: 0,
           frameRate: 5
        });

        //Skeleton
        this.anims.create({
           key: 'skeleton-walk',
           frames: this.anims.generateFrameNames('skeleton', {frames: [1,0,1,2]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'skeleton-walk-left',
           frames: this.anims.generateFrameNames('skeleton', {frames: [4,3,4,5]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'skeleton-walk-right',
           frames: this.anims.generateFrameNames('skeleton', {frames: [7,6,7,8]}),
           repeat: -1,
           frameRate: 12
        });

        //Ghost
        this.anims.create({
           key: 'ghost-walk',
           frames: this.anims.generateFrameNames('ghost', {frames: [1,0,1,2]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'ghost-walk-left',
           frames: this.anims.generateFrameNames('ghost', {frames: [4,3,4,5]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'ghost-walk-right',
           frames: this.anims.generateFrameNames('ghost', {frames: [7,6,7,8]}),
           repeat: -1,
           frameRate: 12
        });

        //Dark slime
        this.anims.create({
           key: 'darkSlime-walk',
           frames: this.anims.generateFrameNames('darkSlime', {frames: [1,0,1,2]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'darkSlime-walk-left',
           frames: this.anims.generateFrameNames('darkSlime', {frames: [4,3,4,5]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'darkSlime-walk-right',
           frames: this.anims.generateFrameNames('darkSlime', {frames: [7,6,7,8]}),
           repeat: -1,
           frameRate: 12
        });

        //Dark wizard
        this.anims.create({
           key: 'darkWizard-walk',
           frames: this.anims.generateFrameNames('darkWizard', {frames: [1,0,1,2]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'darkWizard-walk-left',
           frames: this.anims.generateFrameNames('darkWizard', {frames: [4,3,4,5]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'darkWizard-walk-right',
           frames: this.anims.generateFrameNames('darkWizard', {frames: [7,6,7,8]}),
           repeat: -1,
           frameRate: 12
        });

        //Pumpkin
        this.anims.create({
           key: 'pumpkin-walk',
           frames: this.anims.generateFrameNames('pumpkin', {frames: [1,0,1,2]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'pumpkin-walk-left',
           frames: this.anims.generateFrameNames('pumpkin', {frames: [4,3,4,5]}),
           repeat: -1,
           frameRate: 12
        });

        this.anims.create({
           key: 'pumpkin-walk-right',
           frames: this.anims.generateFrameNames('pumpkin', {frames: [7,6,7,8]}),
           repeat: -1,
           frameRate: 12
        });

    }

}