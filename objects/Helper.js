class Helper{

	constructor(){}

	getRandInt(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	convertPxToTile(x, y, tile_size){

		x -= 4;

		var tx = Math.floor(x / tile_size);
		var ty = Math.floor(y / tile_size);

		return{
			tx: tx,
			ty: ty
		};

	}

	getTileCenter(tx, ty, tile_size){

		var offset = {
			x: 4,
			y: 0
		};

		if(typeof tx == 'object'){
			tile_size = ty;
			ty = tx.ty;
			tx = tx.tx;
		}

		return{
			x: (tx + 0.5) *  tile_size + offset.x,
			y: (ty + 0.5) *  tile_size + offset.y
		};

	}

}