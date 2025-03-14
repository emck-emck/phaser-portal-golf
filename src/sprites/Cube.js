import Phaser from 'phaser';
import {doFriction} from '../utils/utils.js';
import {getCollisionSide} from '../utils/wallUtils.js'
import {DESTROY_THRESHOLD} from '../utils/constants.js';

export default class Cube extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
		//Phaser setup
        super(scene, x, y, 'cube');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		this.scene = scene;
    }

    update() {
		this.doCubeFriction();
    }

	doCubeFriction(){
		doFriction(this);
	}

	wallCollision(cube, wall){
		return true;
	}

	preBallCollision(cube, ball){
		return ball.preCubeCollision(ball, cube);
	}

	ballCollision(cube, ball){
	
	}


	movingWallCollision(cube, m){
		m.wallCollision(m, cube);
		return false;
	}

	PPCollision(cube, pp){
		pp.destroy();
		return false;
	}

	portalCollision(cube, portal){
		return portal.objectPortalCollision(cube, portal);
	}

	dWallOverlap(cube, dWall){
		const dx = cube.x - dWall.x;
        const dy = cube.y - dWall.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));

		if(distance < DESTROY_THRESHOLD){
			//Sound effect
			cube.scene.sound.play('squish');

			cube.destroy();
		}else{
			return true;
		}
	}
}