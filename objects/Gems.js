class Gems extends Entity{

	constructor (ctx, x, y){
		super(ctx, x, y);
		this.helper = new Helper();
	}

	update(){
		this.gemPosit();
	}

	checkGems(){
		this.timeouts = [];
		for(var i = 1; i < 5; i++){
			setTimeout(() => {
				this.gemPosit();
			}, i*100);
		}
		this.timeouts[0] = setTimeout(() => {this.checkGems()}, 500);
	}

	gemPosit(){
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
		this.ctx.generator.checkPositGem(now.tx, now.ty);
	}

	stopTimeout(){
		clearTimeout(0);
	}

}