import {GOAL_BALL_THRESHOLD, GOAL_MAGNETIC_PULL, GOAL_MAGNET_RANGE} from '../utils/constants.js';

export default class Goal extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
		//Phaser setup
        super(scene, x, y, 'goal');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		//Class variables
		this.scene = scene;

		//Collision setup
		this.body.setCircle(this.width / 2);
		//this.setOrigin(0.5, 0.5);
    }

    update() {

    }

	handleBallAtGoal(ball, goal){
		const ballCenterX = ball.x;
		const ballCenterY = ball.y;
		const goalX = goal.x;
		const goalY = goal.y;
		//Make "magnetic pull" for ball to reach goal
		goal.applyMagneticPull(ball);
		//If speed of ball is 0 set game to finished
		if(!ball.isBallMoving() && 
			ballCenterX >= goalX - goal.width/2 &&
			ballCenterX <= goalX + goal.width/2 &&
			ballCenterY >= goalY - goal.height/2 &&
			ballCenterY <= goalY + goal.height/2
		){
			ball.setVisible(false);
			this.sound.play('hole');
			this.win = true;
		}
		return false;
	}

	//Method to apply magnetic pull
    applyMagneticPull(ball) {
		const gx = this.x;
		const gy = this.y;
		const bx = ball.x;
		const by = ball.y;
        const distance = Phaser.Math.Distance.Between(gx, gy, bx, by);
		//Calculate the direction vector from the ball to the goal
		const direction = new Phaser.Math.Vector2(gx - bx, gy - by).normalize();

		if(distance < GOAL_MAGNET_RANGE){
			//Apply a force towards the goal
			ball.body.velocity.x += direction.x * GOAL_MAGNETIC_PULL;
			ball.body.velocity.y += direction.y * GOAL_MAGNETIC_PULL;

			if(distance < GOAL_BALL_THRESHOLD && !ball.isBallSpeedy()){
				ball.body.velocity.x = 0;
				ball.body.velocity.y = 0;
			}
		}
    }
}