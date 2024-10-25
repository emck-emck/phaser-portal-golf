import Phaser from 'phaser';
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
    }

    update() {

    }

	handleBallAtGoal(ball, goal){
		//Make "magnetic pull" for ball to reach goal
		goal.applyMagneticPull(ball);
		//If speed of ball is 0 set game to finished
		if(!ball.isBallMoving()){
			ball.setVisible(false);
			this.scene.launch('WinScene', {
											holeId: this.holeId, 
											totalStrokes: (this.strokes + this.totalStrokes), 
											strokes: this.strokes, 
											par: this.par
			});
			this.scene.pause();
		}
		return false;
	}

	//Method to apply magnetic pull
    applyMagneticPull(ball) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, ball.x, ball.y);
		//Calculate the direction vector from the ball to the goal
		const direction = new Phaser.Math.Vector2(this.x - ball.x, this.y - ball.y).normalize();

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