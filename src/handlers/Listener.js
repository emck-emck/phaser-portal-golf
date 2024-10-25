import Phaser from 'phaser';
import {PORTAL_ORANGE, PORTAL_BLUE} from '../utils/constants.js';

export default class Listener {

    constructor(scene) {
		//Class variables
		this.scene = scene;
		this.ball = scene.ball;

		//Listener setup
		this.scene.input.on('pointerdown', this.onPointerDown, this);
		this.scene.input.on('pointerup', this.onPointerUp, this);
		this.scene.input.keyboard.on('keydown-Q', this.onPortalShoot, this);
		this.scene.input.keyboard.on('keydown-E', this.onPortalShoot, this);
		this.scene.input.keyboard.on('keydown-W', this.onShotCancel, this);
		this.scene.input.keyboard.on('keydown-ESC', this.pauseGame, this);
    }

	//When the mouse is clicked down
	onPointerDown(pointer){
		if(!this.ball.isBallMoving()){
			this.ball.mouseDownCoords = {x: Math.floor(pointer.x), y: Math.floor(pointer.y)};
			this.scene.powerBarActive = true;
		}
	}

	//When the mouse is unclicked
	onPointerUp(pointer){
		if(!this.ball.isBallMoving() && this.ball.mouseDownCoords != null){
			this.ball.doBallShoot(pointer);
			this.scene.powerBarActive = false;
		}
	}

	//When Q or E are pressed
	onPortalShoot(key){
		if(key.code == 'KeyQ'){
			this.ball.doPortalShoot(PORTAL_ORANGE);
		}else if(key.code == 'KeyE'){
			this.ball.doPortalShoot(PORTAL_BLUE);
		}
	}

	onShotCancel(key){
		this.ball.mouseDownCoords = {};
		this.scene.powerBarActive = false;
	}

	pauseGame(key){
		this.scene.scene.launch('PauseMenu');
		this.scene.scene.pause('GameScene');
	}

}