import {FRICTION, FRICTION_SAND} from './constants.js';
import Ball from '../sprites/Ball.js';

//Handles friction for objects
export function doFriction(obj){
	// Get the tile at the object's position
	var tile;
	const tileX = obj.scene.map.worldToTileX(obj.x);
	const tileY = obj.scene.map.worldToTileY(obj.y);
	if(obj.scene.groundLayer){
		tile = obj.scene.groundLayer.getTileAt(tileX, tileY); // Detect the tile
	}
	
	//If a tile is found
	if(tile){
		if(tile.tileset === obj.scene.sandTile){ //If sand tile
			obj.setVelocity(obj.body.velocity.x * FRICTION_SAND, obj.body.velocity.y * FRICTION_SAND);
		}else if(tile.tileset === obj.scene.waterTile){ // If water tile
			obj.scene.sound.play('splash'); //Sound effect
			if(obj instanceof Ball){ // Ball reset to last spot
				// Disable and shortly after re-enable the ball's body
				// Keeps body inert for position update
				obj.body.enable = false;

				//Do necessary updates to ball
				obj.setVelocity(0, 0);
				obj.setPosition(obj.lastSpot.x, obj.lastSpot.y);				
				
				//Re-enable ball body
				setTimeout(() => {
					obj.body.enable = true;
				}, 10);
			}else{ //Cubes
				obj.destroy();
			}
		}else{ // Regular ground
			obj.setVelocity(obj.body.velocity.x * FRICTION, obj.body.velocity.y * FRICTION);
		}
	}else{ //Default friction
		obj.setVelocity(obj.body.velocity.x * FRICTION, obj.body.velocity.y * FRICTION);
	}
}