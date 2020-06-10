class Text{

	constructor(ctx, x, y, string, style, origin){
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.text = string;
		this.style = this.initStyle(style);
		this.origin = this.initOrigin(origin);
		this.obj = this.createText();
	}

	initStyle(key){

		let style = {
			fontFamily: 'ClickPixel',
			fontSize: 32,
			color: '0xFFFFFF',
			align: 'center'
		};

		switch(key.toLowerCase()){
			case 'title':
				style.fontSize = 64;
				break;
			case 'controls':
				style.fontSize = 24;
				break;
			case 'preload':
				style.fontSize = 48;
				break;
			case 'score':
				style.fontSize = 24;
				break;
		}

		return style;

	}

	initOrigin(origin){ //Se establece la posición del texto

		if (typeof origin === 'number'){
			return{
				x: origin,
				y: origin
			};
		}

		else if (typeof origin === 'object'){
			return origin;
		}

		else{
			return{
				x: 0.5,
				y: 0.5
			};
		}

	}

	createText(){

		let obj = this.ctx.add.bitmapText(
			this.x,
			this.y,
			this.style.fontFamily,
			this.text,
			this.style.fontSize,
			this.style.align
		);

		obj.setOrigin(this.origin.x, this.origin.y);

		return obj;

	}

	destroy(){
		 this.obj.destroy();
		 this.obj = false;
	}

	//Setters

	setText(string){
		this.text = string;
		this.obj.setText(string);
	}

	setX(x){
		this.x = x;
		this.obj.setX(x);
	}

	setY(y){
		this.y = y;
		this.obj.setY(y);
	}

	setOrigin(origin){
		this.origin = this.initOrigin(origin);
		this.obj.setOrigin(origin);
	}

	setDepth(depth){
		this.obj.setDepth(depth);
	}

	setScrollFactor(scrollX, scrollY){
		this.obj.setScrollFactor(scrollX, scrollY);
	}

	setVisible(is_visible){
		this.obj.setVisible(is_visible);
	}

	setAlpha(alpha){
		this.alpha = alpha;
		this.obj.setAlpha(alpha);
		this.width = this.obj.width;
		this.height = this.obj.height;
	}

	setFontSize(size){
		this.style.fontSize = size;
	}

	setCenterAlign(){
		this.style.align = 'center';
		this.obj.setCenterAlign();
	}

	//Getters

	getCenter(){
		return this.obj.getCenter();
	}

	getTopLeft(){
		return this.obj.getTopLeft();
	}

	getTopRight(){
		return this.obj.getTopRight();
	}

	getBottomLeft(){
		return this.obj.getBottomLeft();
	}

	getBottomRight(){
		return this.obj.getBottomRight();
	}

}