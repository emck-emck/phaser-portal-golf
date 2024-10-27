import {FRICTION, FRICTION_SAND} from './constants.js';

//Handles friction for objects
export function doFriction(obj){/*
	// Get the tile at the object's position
	const tileX = obj.scene.map.worldToTileX(obj.x);
	const tileY = obj.scene.map.worldToTileY(obj.y);
	var sandTile = null;
	//If there's sand on the course
	if(obj.scene.sand){
		sandTile = obj.scene.sand.getTileAt(tileX, tileY); // Detect if there's sand underneath the object
	}
	
	if(sandTile){
		obj.setVelocity(obj.body.velocity.x * FRICTION_SAND, obj.body.velocity.y * FRICTION_SAND);
	}else{
		obj.setVelocity(obj.body.velocity.x * FRICTION, obj.body.velocity.y * FRICTION);
	}*/
	obj.setVelocity(obj.body.velocity.x * FRICTION, obj.body.velocity.y * FRICTION);
}

export function ppWallCollision(pp, wall){
	console.log(pp);
	console.log(wall);
	if(wall.tileset === pp.scene.wallTile){
		pp.destroy();
	}else if(wall.tileset === pp.scene.iWallTile){
		pp.destroy();
	}else{
		throw new error("Something unexpected in the wall layer");
	}
}