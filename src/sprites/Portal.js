import {HORIZONTAL, VERTICAL} from '../utils/constants.js';
import {getObjectRotation, isEmpty, teleportObject, teleportMWall, setObjectVelocityAfterPortal} from '../utils/portalUtils.js';
import {setPortalWallColliders} from '../utils/wallUtils.js';

export default class Portal extends Phaser.Physics.Arcade.Sprite {
	static instances = {};

    constructor(scene, coords, key) {
		//Phaser setup (Object init)
        super(scene, coords.x, coords.y, (key + coords.orientation));
        scene.add.existing(this);
        scene.physics.add.existing(this);
		scene.portalGroup.add(this);
		this.body.immovable = true;

		//Mask setup
		this.maskShape = scene.make.graphics();
		if(coords.orientation == HORIZONTAL){
			this.maskShape.fillCircle(coords.x, coords.y, this.width/2);
			this.maskShape.setScale(1, 1);
		}else if(coords.orientation == VERTICAL){
			this.maskShape.fillCircle(coords.x, coords.y, this.height/2);
			this.maskShape.setScale(1, 1);
		}
		this.mask = this.maskShape.createGeometryMask();
		this.setMask(this.mask);

		//Class variables
		this.collisionSide = coords.collisionSide;
		this.scene = scene;
		this.key = key;
		Portal.instances[key] = this;

		//Set Wall Colliders
		setPortalWallColliders(this.scene.wallLayer, Portal.instances);
		
		//Sound effect
		this.scene.sound.play('pspawn');
    }

	static destroyByProperty(s, key) {
		const instance = Portal.instances[key];
		if (instance) {
			instance.destroy();
			delete Portal.instances[key];
			if(s.wallLayer.tileset.length > 0){
				setPortalWallColliders(s.wallLayer, Portal.instances);
			}
		}
	}

    update() {

    }

	//Wizardry courtesy of StackOverflow
	checkOtherPortal(p){
		return Object.keys(Portal.instances)
							.filter((k) => k != p.key)
							.reduce((obj, k) => {
								return {
									...obj,
									[k]: Portal.instances[k]
								};
							}, {});
	}

	//Similar to objectPortalCollision but has some custom logic
	mWallCollision(m, portal){
		var otherPortal = this.checkOtherPortal(portal);
		if(!isEmpty(otherPortal)){
			otherPortal = Object.values(otherPortal)[0]; //Unwrap the portal object from the Javascript object
			const rotation = getObjectRotation(portal, otherPortal); //Calculate the orientation of the object
			teleportMWall(m, otherPortal); //Move object to the out portal
			const vel = setObjectVelocityAfterPortal(m, rotation); //Set proper velocity for object 
			//Fix for sin/cos math that messes with wall behaviour
			if(vel.x > -1 && vel.x < 1){
				vel.x = 0;
			}
			if(vel.y > -1 && vel.y < 1){
				vel.y = 0;
			}
			//Sound effect
			m.scene.sound.play('penter');
			return false;
		}else{
			return m.wallCollision(m, portal);
		}
	}

	objectPortalCollision(object, portal){
		//Get other portal
		var otherPortal = this.checkOtherPortal(portal);

		//if other portal
		if(!isEmpty(otherPortal)){
			otherPortal = Object.values(otherPortal)[0]; //Unwrap the portal object from the Javascript object
			const rotation = getObjectRotation(portal, otherPortal); //Calculate the orientation of the object
			teleportObject(object, otherPortal); //Move object to the out portal
			setObjectVelocityAfterPortal(object, rotation); //Set proper velocity for object
			object.scene.sound.play('penter'); //Sound effect
			return false;
		}
		return true;
	}
}