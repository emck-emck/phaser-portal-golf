import Phaser from 'phaser';
import {PROJECTILE, COLLISION_DEBOUNCE_TIME} from '../utils/constants.js'
import Portal from './Portal.js';

export default class PortalP extends Phaser.Physics.Arcade.Sprite {
	static lastCollisionTime = 0;

    constructor(scene, x, y, key) {
		//Phaser setup
        super(scene, x, y, (key + PROJECTILE));
        scene.add.existing(this);
        scene.physics.add.existing(this);

		//Class variables
		this.scene = scene;
		this.key = key;

		//Collision setup
		this.body.setCircle(this.width / 2);
		this.scene.physics.add.collider(this, this.scene.wallLayer, this.wallCollision.bind(this));
		this.scene.ppGroup.add(this);
    }

    update() {

    }

	wallCollision(pp, wall){
		if(wall.tileset === pp.scene.wallTile){
			const currentTime = Date.now();
			if (currentTime - PortalP.lastCollisionTime >= COLLISION_DEBOUNCE_TIME) {
				new Portal(this.scene, this.body.center.x, this.body.center.y, this.key, wall);
				PortalP.lastCollisionTime = currentTime;
				this.destroy();
			}
		}else if(wall.tileset === pp.scene.iWallTile){
			pp.destroy();
		}else{
			throw new error("Something unexpected in the wall layer");
		}
	}
}