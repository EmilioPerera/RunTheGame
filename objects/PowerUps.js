class PowerUps extends Entity{

	constructor (ctx, x, y){
		super(ctx, x, y);
		this.helper = new Helper();
	}

	update(){
			this.powerUpPosit();
	}

	checkPowerUp(){
		this.timeouts = [];
		for(var i = 1; i < 5; i++){
			setTimeout(() => {
				this.powerUpPosit();
			}, i*100);
		}
		this.timeouts[0] = setTimeout(() => {this.checkPowerUp()}, 500);
	}

	powerUpPosit(){
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
		this.ctx.generator.checkPositPowerUp(now.tx, now.ty);
	}

	stopTimeout(){
		clearTimeout(0);
	}

}