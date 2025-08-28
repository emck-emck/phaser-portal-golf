import {DESTROY_THRESHOLD, TIMEOUT, TIMEOUT_LONG} from '../utils/constants.js';

export default class MovingWall extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, speed, isHorizontal) {
		//Phaser setup
        super(scene, x, y, 'inactivewall');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		this.scene = scene;
		this.isHorizontal = isHorizontal;
		this.speed = speed;
		
		this.lastHit = Date.now();
		this.lastPortal = Date.now();
		this.timer = Date.now();
    }

	//Prevents damping when the moving wall collides with the ball
    update() {
		//If the ball has slowed down or sped up (either x or y)
		if(Math.abs(this.body.velocity.x) != this.speed && Math.abs(this.body.velocity.y) != this.speed){
			//Reset velocity of required vector
			if(this.body.velocity.x > 0){
				this.setVelocity(this.speed, 0);
			}
			if(this.body.velocity.x < 0){
				this.setVelocity(-this.speed, 0);
			}
			if(this.body.velocity.y > 0){
				this.setVelocity(0, this.speed);
			}
			if(this.body.velocity.y < 0){
				this.setVelocity(0, -this.speed);
			}
		}
    }

	setVel(){
		if(this.isHorizontal){
			this.setVelocity(this.speed, 0);
		}else{
			this.setVelocity(0, this.speed);
		}
	}

	dWallCollision(mWall, dWall){
		const dx = mWall.x - dWall.x;
        const dy = mWall.y - dWall.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));

		if(distance < DESTROY_THRESHOLD){
			mWall.scene.sound.play('squish');
			mWall.destroy();
		}else{
			mWall.wallCollision(mWall, dWall);
		}
	}

	wallCollision(movingWall, wall){
		if(Date.now() >= movingWall.lastHit + TIMEOUT){
			movingWall.setVelocityX(-movingWall.body.velocity.x);
			movingWall.setVelocityY(-movingWall.body.velocity.y);
			movingWall.lastHit = Date.now();
		}
		return false;
	}

	PPCollision(mWall, pp){
		pp.destroy();
		return false;
	}

	portalCollision(mWall, portal){
		if(Date.now() >= mWall.lastPortal + TIMEOUT_LONG){
			mWall.lastPortal = Date.now();
			return portal.mWallCollision(mWall, portal);
		}else{
			return false;
		}
	}

	ballCollision(mWall, ball){

	}

}