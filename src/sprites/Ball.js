import Phaser from 'phaser';

import PortalP from './PortalP.js';
import {isEmpty} from '../utils/portalUtils.js';
import {doFriction} from '../utils/utils.js';
import {PP_SPEED, BALL_FORCE_MULTIPLIER, BALL_LOW_SPEED, BALL_STOP_SPEED, MAX_BALL_SPEED} from '../utils/constants.js';

export default class Ball extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
		//Phaser setup
        super(scene, x, y, 'ball');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		//Mask setup
		this.maskShape = scene.make.graphics();
		this.maskShape.fillCircle(x, y, this.width/2);
		this.mask = this.maskShape.createGeometryMask();
		this.setMask(this.mask);

		//Collision setup
		this.setBounce(1);
		this.body.setCircle(this.width / 2);

		//Class variables
		this.scene = scene;
		this.lastSpot = {x: x, y: y};
		this.mouseDownCoords = {};
		this.lastPortal = Date.now();
    }

    update() {
		//Mask stuff
		this.maskShape.clear();
		this.maskShape.fillCircle(this.x, this.y, this.width/2);
		this.mask = this.maskShape.createGeometryMask();
		this.setMask(this.mask);

		//Friction stuff
        this.doBallFriction();
		this.doBallStop();
    }

	//Handles the ball velocity when a shot is made
	doBallShoot(pointer){
		if(isEmpty(this.mouseDownCoords)){
			return;
		}
		var forcex = pointer.x - this.mouseDownCoords.x;
		var forcey = pointer.y - this.mouseDownCoords.y;
	
		var force = (Math.sqrt(forcex**2 + forcey**2)*BALL_FORCE_MULTIPLIER);
		if(force > MAX_BALL_SPEED){
			force = MAX_BALL_SPEED;
		}
	
		const velocity = new Phaser.Math.Vector2(
													pointer.x - this.mouseDownCoords.x, 
													pointer.y - this.mouseDownCoords.y
		).normalize().scale(force);
	
		this.setVelocity(-velocity.x, -velocity.y);
		this.scene.strokes++;
		this.mouseDownCoords = {};
	}

	//Handles when a portal is shot
	doPortalShoot(key){
		const pp = new PortalP(this.scene, this.x, this.y, key);
		const velocity = new Phaser.Math.Vector2(
													this.scene.input.activePointer.x - this.x, 
													this.scene.input.activePointer.y - this.y
		).normalize().scale(PP_SPEED);
		
		pp.setVelocity(velocity.x, velocity.y);
	}

	portalCollision(ball, portal){
		if(Date.now() >= ball.lastPortal + 50){
			console.log("Last hit available");
			ball.lastPortal = Date.now();
			return portal.objectPortalCollision(ball, portal);
		}
		return true;
	}

	hazardCollision(ball, hazard){
		if(hazard.tileset === ball.scene.waterTile){
			const ballCenterX = ball.x;
			const ballCenterY = ball.y;
		
			// Check if the center of the ball is within the bounds of the tile
			if (ballCenterX >= hazard.pixelX &&
				ballCenterX <= hazard.pixelX + hazard.width &&
				ballCenterY >= hazard.pixelY &&
				ballCenterY <= hazard.pixelY + hazard.height
			) {
				ball.setVelocity(0);
				ball.x = ball.lastSpot.x;
				ball.y = ball.lastSpot.y;
			}
		}else if(hazard.tileset === ball.scene.sandTile){
			ball.doBallFriction();
		}
	}

	wallCollision(ball, wall){
		console.log("Ball hit wall at coord " + wall.x + " ," + wall.y);
	}

	//Handles ball friction
	doBallFriction(){
		doFriction(this);
	}

	//Fully stops the ball once it reaches a certain low speed
	doBallStop(){
		if(!this.isBallMoving() && this.body.velocity.x != 0 && this.body.velocity.y != 0){
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
			this.lastSpot = this.getCenter();
		}
	}

	//Returns whether or not the ball is in motion
	isBallMoving(){
		if(Math.abs(this.body.velocity.x) > BALL_STOP_SPEED || Math.abs(this.body.velocity.y) > BALL_STOP_SPEED){
			return true;
		}
		return false;
	}

	//Used for ball-goal interaction to determine if the ball is moving fast
	isBallSpeedy(){
		if(Math.abs(this.body.velocity.x) > BALL_LOW_SPEED || Math.abs(this.body.velocity.y) > BALL_LOW_SPEED){
			return true;
		}
		return false;
	}
}