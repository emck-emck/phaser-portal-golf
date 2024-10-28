import Phaser from 'phaser';
import {doFriction} from '../utils/utils.js';
import {getCollisionSide} from '../utils/wallUtils.js'

export default class Cube extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
		//Phaser setup
        super(scene, x, y, 'cube');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		this.scene = scene;
		this.side = '';
    }

    update() {
		this.doCubeFriction();
    }

	doCubeFriction(){
		doFriction(this);
	}

	wallCollision(cube, wall){
		var side = getCollisionSide(cube.body.center.x, cube.body.center.y, wall);
		cube.side = side + cube.side.substring(0, 12);
		return true;
	}

	ballCollision(cube, ball){
		const cx = (cube.body.center.x + ball.body.center.x) / 2
		const cy = (cube.body.center.y + ball.body.center.y) / 2
		var ballSide = getCollisionSide(cx, cy, cube);
		
		if(cube.side.includes(ballSide)){
			return true;
		}else{
			if(ballSide == 'top' || ballSide == 'bottom'){
				cube.setVelocity(0, ball.body.velocity.y*1.1);
			}else if(ballSide == 'left' || ballSide == 'right'){
				cube.setVelocity(ball.body.velocity.x*1.1, 0);
			}
			return false;
		}		
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
}