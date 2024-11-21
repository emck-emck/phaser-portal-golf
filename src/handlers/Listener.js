import Phaser from 'phaser';
import {PORTAL_ORANGE, PORTAL_BLUE} from '../utils/constants.js';

export default class Listener {

    constructor(scene) {
		//Class variables
		this.scene = scene;
		this.ball = scene.ball;

		//Key locks
		this.isQDown = false;
		this.isWDown = false;
		this.isEDown = false;
		this.isFDown = false;

		//Listener setup

		//Mouse
		this.scene.input.on('pointerdown', this.onPointerDown, this);
		this.scene.input.on('pointerup', this.onPointerUp, this);
		this.scene.canvas.addEventListener('mouseleave', this.onPointerOut.bind(this));
		
		//Keys
		//Keydown
		this.scene.input.keyboard.on('keydown-Q', this.onPortalShoot, this);
		this.scene.input.keyboard.on('keydown-E', this.onPortalShoot, this);
		this.scene.input.keyboard.on('keydown-W', this.onShotCancel, this);
		this.scene.input.keyboard.on('keydown-F', this.fullscreen, this);
		this.scene.input.keyboard.on('keydown-P', this.pauseGame, this);
		//Keyup
		this.scene.input.keyboard.on('keyup-Q', this.releaseQ, this);
		this.scene.input.keyboard.on('keyup-E', this.releaseE, this);
		this.scene.input.keyboard.on('keyup-W', this.releaseW, this);
		this.scene.input.keyboard.on('keyup-F', this.releaseF, this);
    }

	shutdown(){
		//Mouse
		this.scene.input.off('pointerdown', this.onPointerDown, this);
		this.scene.input.off('pointerup', this.onPointerUp, this);
		this.scene.canvas.removeEventListener('mouseleave', this.onPointerOut.bind(this));
		
		//Keys
		//Keydown
		this.scene.input.keyboard.off('keydown-Q', this.onPortalShoot, this);
		this.scene.input.keyboard.off('keydown-E', this.onPortalShoot, this);
		this.scene.input.keyboard.off('keydown-W', this.onShotCancel, this);
		this.scene.input.keyboard.off('keydown-F', this.fullscreen, this);
		this.scene.input.keyboard.off('keydown-P', this.pauseGame, this);
		//Keyup
		this.scene.input.keyboard.off('keyup-Q', this.releaseQ, this);
		this.scene.input.keyboard.off('keyup-E', this.releaseE, this);
		this.scene.input.keyboard.off('keyup-W', this.releaseW, this);
		this.scene.input.keyboard.off('keyup-F', this.releaseF, this);
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

	onPointerOut(pointer){
		this.ball.mouseDownCoords = {};
		this.scene.powerBarActive = false;
	}

	//When Q or E are pressed
	onPortalShoot(key){
		if(key.code == 'KeyQ' && !this.isQDown){
			this.isQDown = true;
			this.ball.doPortalShoot(PORTAL_ORANGE);
		}else if(key.code == 'KeyE' && !this.isEDown){
			this.isEDown = true;
			this.ball.doPortalShoot(PORTAL_BLUE);
		}
	}

	releaseQ(key){
		this.isQDown = false;
	}

	releaseE(key){
		this.isEDown = false;
	}

	onShotCancel(key){
		if(!this.isWDown){
			this.isWDown = true;
			this.ball.mouseDownCoords = {};
			this.scene.powerBarActive = false;
		}
	}

	releaseW(key){
		this.isWDown = false;
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

	pauseGame(key){
		this.scene.scene.launch('PauseMenu');
		this.scene.scene.pause('GameScene');
	}

}