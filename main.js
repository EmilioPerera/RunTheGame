function runApp(){

	'use strict';

	//Lanza el juego
	var app = new App();
	app.start();

	//Escala el juego en función del dispositivo
	window.addEventListener('resize', resizeApp);
	resizeApp();
	
}

window.onload = function (){
	
	'use strict';

	/*try {
		eval('var i = 0;');
		eval('const _dev = true');
	} 
    catch (e) {
		this.alert('Lo siento, el juego no tiene soporte para este navegador. Por favor, utiliza Firefox o Chrome.');
		return false;
	}*/

	runApp();

};

function resizeApp() {
    'use strict';

    var game_ratio      = 360 / 640;
    var div             = document.getElementById('phaser-app');
    div.style.width     = (window.innerHeight * game_ratio) + 'px';
    div.style.height    = window.innerHeight + 'px';
    var canvas          = document.getElementsByTagName('canvas')[0];
    var dpi_w           = (parseInt(div.style.width) / canvas.width);
    var dpi_h           = (parseInt(div.style.height) / canvas.height);
    var height          = window.innerHeight * (dpi_w / dpi_h);
    var width           = height * game_ratio;
    canvas.style.width  = width + 'px';
    canvas.style.height = height + 'px';

}