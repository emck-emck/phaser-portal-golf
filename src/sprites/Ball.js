import PortalP from './PortalP.js';
import {isEmpty} from '../utils/portalUtils.js';
import {doFriction} from '../utils/utils.js';
import {DESTROY_THRESHOLD, PP_SPEED, BALL_FORCE_MULTIPLIER, BALL_LOW_SPEED, BALL_STOP_SPEED, MAX_BALL_SPEED, TIMEOUT} from '../utils/constants.js';

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
		this.setOrigin(0.5, 0.5);

		//Class variables
		this.scene = scene;
		this.lastSpot = this.getCenter();
		this.mouseDownCoords = {};
		this.lastPortal = Date.now();
		this.lastVel = new Phaser.Math.Vector2();
		this.collision = false;

		//Debug variable
		this.timer = Date.now();
    }

    update() {
		//Mask stuff
		this.maskShape.clear();
		this.maskShape.fillCircle(this.x, this.y, this.width/2);
		this.mask = this.maskShape.createGeometryMask();
		this.setMask(this.mask);

		//Friction stuff
        this.doBallFriction();

		//Timer debug
		if(Date.now() >= this.timer + 1000){
			this.timer = Date.now();
			//Debug code goes here
			// console.log(this.body.velocity);
			// console.log(this.x);
			// console.log(this.y);
		}
    }

	// Phaser function for handling things after collisions
	postUpdate() {
		if(this.collision){
			this.body.velocity.x = this.lastVel.x;
			this.body.velocity.y = this.lastVel.y;
			this.collision = false;
			this.lastVel = new Phaser.Math.Vector2();
		}
	}

	//Handles the ball velocity when a shot is made
	doBallShoot(pointer){
		//Handle off-screen problems
		if(isEmpty(this.mouseDownCoords)){
			return;
		}
		//Set last location ball was on the map (for water traps)
		this.lastSpot = this.getCenter();

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

		//Sound effect
		this.scene.sound.play('putt');
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
		if(Date.now() >= ball.lastPortal + TIMEOUT){
			ball.lastPortal = Date.now();
			return portal.objectPortalCollision(ball, portal);
		}
		return true;
	}

	dWallOverlap(dWall, ball){
		const dx = ball.x - dWall.x;
        const dy = ball.y - dWall.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));

		if(distance < DESTROY_THRESHOLD){
			// Disable and shortly after re-enable the ball's body
			// Keeps body inert for position update
			ball.body.enable = false;

			//Do necessary updates to ball
			ball.setVelocity(0, 0);
			ball.setPosition(ball.lastSpot.x, ball.lastSpot.y);	

			//Sound effect
			ball.scene.sound.play('squish');
			
			//Re-enable ball body
			setTimeout(() => {
				ball.body.enable = true;
			}, 10);
		}else{
			return true;
		}
	}

	preCubeCollision(ball, cube){
		ball.lastVel.x = ball.body.velocity.x;
		ball.lastVel.y = ball.body.velocity.y;
		ball.collision = true;
		return true;
	}

	//Handles ball friction
	doBallFriction(){
		doFriction(this);
		if(!this.isBallMoving()){
			this.body.stop();
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