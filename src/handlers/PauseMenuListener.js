import Phaser from 'phaser';

export default class PauseMenuListener {

    constructor(scene) {
		//Class variables
		this.scene = scene;
		this.ball = scene.ball;

		//Key locks
		this.isFDown = false;

		//Listener setup
		this.scene.input.keyboard.on('keydown-P', this.resumeGame, this);
		this.scene.input.keyboard.on('keydown-F', this.fullscreen, this);
		this.scene.input.keyboard.on('keyup-F', this.releaseF, this);
    }

	resumeGame(){
		this.scene.resumeGame();
	}

	fullscreen(key){
		if(!this.isFDown){
			this.isFDown = true;
			if (!this.scene.scale.isFullscreen) {
				this.scene.scale.startFullscreen();
			} else {
				this.scene.scale.stopFullscreen();
			}
		}
	}

	releaseF(key){
		this.isFDown = false;
	}
}