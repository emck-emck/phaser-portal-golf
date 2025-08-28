import {portalPlacement} from '../utils/portalUtils.js';
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
		this.scene.physics.add.collider(this, this.scene.wallLayer, this.wallCollision);
		this.scene.ppGroup.add(this);
    }

    update() {

    }

	wallCollision(pp, wall){
		if(pp.scene){
			if(wall.tileset === pp.scene.wallTile){
				const currentTime = Date.now();
				if (currentTime - PortalP.lastCollisionTime >= COLLISION_DEBOUNCE_TIME) {
					//Get valid coords for portal
					const coords = portalPlacement(pp.body.center.x, pp.body.center.y, wall, pp.scene.wallLayer);
					//Destroy old portals
					Portal.destroyByProperty(pp.scene, pp.key);
					//Create new portal
					
					PortalP.lastCollisionTime = currentTime;
					if(coords){
						new Portal(pp.scene, coords, pp.key);
					}
				}
				pp.destroy();
			}else{
				pp.destroy();
			}
		}
	}
}