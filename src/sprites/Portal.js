import Phaser from 'phaser';
import {HORIZONTAL, VERTICAL, OFFSET_PORTAL_PLACE} from '../utils/constants.js';
import {getObjectRotation, isEmpty, teleportObject, setObjectVelocityAfterPortal} from '../utils/portalUtils.js';
import {getCollisionSide, getNearestValidWall, setPortalWallColliders} from '../utils/wallUtils.js';

export default class Portal extends Phaser.Physics.Arcade.Sprite {
	static instances = {};

    constructor(scene, x, y, key, wall) {
		//Initial setup
		const coords = portalPlacement(x, y, wall, scene.walls);

		//Delete portals of the same colour other than this one
		Portal.destroyByProperty(scene, key);

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
		setPortalWallColliders(this.scene.walls, Portal.instances);
    }

	static destroyByProperty(s, key) {
		const instance = Portal.instances[key];
		if (instance) {
			instance.destroy();
			delete Portal.instances[key];
			setPortalWallColliders(s.walls, Portal.instances);
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
			teleportObject(m, otherPortal); //Move object to the out portal
			const vel = setObjectVelocityAfterPortal(m, rotation); //Set proper velocity for object 
			//Fix for sin/cos math that messes with wall behaviour
			if(vel.x > -1 && vel.x < 1){
				vel.x = 0;
			}
			if(vel.y > -1 && vel.y < 1){
				vel.y = 0;
			}
			return false;
		}else{
			console.log("Only one portal");
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
			return false;
		}
		return true;
	}
}

//Returns the x and y coordinates of where the portal should be placed or throws error if invalid
	//Also returns orientation of the portal (horizontal or vertical)
	//Return collision side as well; this is done here to indent the portal a bit out of the wall
function portalPlacement(x, y, wall, wallLayer){
	const nearestWall = getNearestValidWall(x, y, wall, wallLayer);
	const collisionSide = getCollisionSide(x, y, wall);

	if(!nearestWall){
		throw new Error('Portal Cancel');
	}

	//Determine if connection is horizontal or vertical
	if(wall.x == nearestWall.x){ // vertical
		if(wall.y > nearestWall.y){
			if(collisionSide == 'left'){
				return {x: (nearestWall.pixelX + nearestWall.width/2 - OFFSET_PORTAL_PLACE), 
						y: (nearestWall.pixelY + nearestWall.height),
						orientation: VERTICAL,
						collisionSide: 'left'};
			}else if(collisionSide == 'right'){
				return {x: (nearestWall.pixelX + nearestWall.width/2 + OFFSET_PORTAL_PLACE), 
						y: (nearestWall.pixelY + nearestWall.height),
						orientation: VERTICAL,
						collisionSide: 'right'};
			}
		}else{
			if(collisionSide == 'left'){
				return {x: (wall.pixelX + wall.width/2 - OFFSET_PORTAL_PLACE), 
						y: (wall.pixelY + wall.height),
						orientation: VERTICAL,
						collisionSide: 'left'};
			}else if(collisionSide == 'right'){
				return {x: (wall.pixelX + wall.width/2 + OFFSET_PORTAL_PLACE), 
						y: (wall.pixelY + wall.height),
						orientation: VERTICAL,
						collisionSide: 'right'};
			}
			
		}
	}else if(wall.y == nearestWall.y){ //horizontal
		if(wall.x > nearestWall.x){
			if(collisionSide == 'top'){
				return {x: (nearestWall.pixelX + nearestWall.width), 
						y: (nearestWall.pixelY + nearestWall.height/2 - OFFSET_PORTAL_PLACE),
						orientation: HORIZONTAL,
						collisionSide: 'top'};
			}else if(collisionSide == 'bottom'){
				return {x: (nearestWall.pixelX + nearestWall.width), 
						y: (nearestWall.pixelY + nearestWall.height/2 + OFFSET_PORTAL_PLACE),
						orientation: HORIZONTAL,
						collisionSide: 'bottom'};
			}
		}else{
			if(collisionSide == 'top'){
				return {x: (wall.pixelX + wall.width), 
						y: (wall.pixelY + nearestWall.height/2 - OFFSET_PORTAL_PLACE),
						orientation: HORIZONTAL,
						collisionSide: 'top'};
			}else if(collisionSide == 'bottom'){
				return {x: (wall.pixelX + wall.width), 
						y: (wall.pixelY + nearestWall.height/2 + OFFSET_PORTAL_PLACE),
						orientation: HORIZONTAL,
						collisionSide: 'bottom'};
			}
		}
	}else{
		throw new Error('Portal Cancel');
	}
}