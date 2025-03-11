import {HORIZONTAL, OFFSET_PORTAL_BALL, OFFSET_PORTAL_PLACE, TIMEOUT_LONG, VERTICAL} from './constants.js';
import {getNearestValidWall, getCollisionSide} from './wallUtils.js';

//Detects empty object (as in the {} object)
export function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

//Gets the angle the ball should be rotated by given the positions of the portals
export function getObjectRotation(inPortal, outPortal){
	var velRotation;
	if(inPortal.collisionSide == 'left'){
		if(outPortal.collisionSide == 'left'){
			velRotation = 180;
		}else if(outPortal.collisionSide == 'right'){
			velRotation = 0;
		}else if(outPortal.collisionSide == 'top'){
			velRotation = 270;
		}else if(outPortal.collisionSide == 'bottom'){
			velRotation = 90;
		}
	}else if(inPortal.collisionSide == 'right'){
		if(outPortal.collisionSide == 'left'){
			velRotation = 0;
		}else if(outPortal.collisionSide == 'right'){
			velRotation = 180;
		}else if(outPortal.collisionSide == 'top'){
			velRotation = 90;
		}else if(outPortal.collisionSide == 'bottom'){
			velRotation = 270;
		}
	}else if(inPortal.collisionSide == 'top'){
		if(outPortal.collisionSide == 'left'){
			velRotation = 90;
		}else if(outPortal.collisionSide == 'right'){
			velRotation = 270;
		}else if(outPortal.collisionSide == 'top'){
			velRotation = 180;
		}else if(outPortal.collisionSide == 'bottom'){
			velRotation = 0;
		}
	}else if(inPortal.collisionSide == 'bottom'){
		if(outPortal.collisionSide == 'left'){
			velRotation = 270;
		}else if(outPortal.collisionSide == 'right'){
			velRotation = 90;
		}else if(outPortal.collisionSide == 'top'){
			velRotation = 0;
		}else if(outPortal.collisionSide == 'bottom'){
			velRotation = 180;
		}
	}
	return velRotation;
}

//Moves the object to the exit portal, distanced so that it doesn't get stuck in it
export function teleportObject(object, exitPortal){
	if(exitPortal.collisionSide == 'left'){
		object.x = exitPortal.x - (exitPortal.width/2 + object.width/2 + OFFSET_PORTAL_BALL);
		object.y = exitPortal.y;
	}else if(exitPortal.collisionSide == 'right'){
		object.x = exitPortal.x + (exitPortal.width/2 + object.width/2 + OFFSET_PORTAL_BALL);
		object.y = exitPortal.y;
	}else if(exitPortal.collisionSide == 'top'){
		object.x = exitPortal.x;
		object.y = exitPortal.y - (exitPortal.height/2 + object.height/2 + OFFSET_PORTAL_BALL);
	}else if(exitPortal.collisionSide == 'bottom'){
		object.x = exitPortal.x;
		object.y = exitPortal.y + (exitPortal.height/2 + object.height/2 + OFFSET_PORTAL_BALL);
	}
}

export function teleportMWall(m, exitPortal){
	const s = m.scene;

	m.x = exitPortal.x;
	m.y = exitPortal.y;
	

	// Code to temporarily disable walls overlapping with new mWall position
	const mw = m.width;
	const mh = m.height;
	const mx = m.x - mw/2;
	const my = m.y - mh/2;
	const tiles = s.wallLayer.getTilesWithinWorldXY(mx, my, mw, mh);

	tiles.forEach(tile => {
		
		if(tile && tile.index !== -1){
			const tileX = tile.x;
			const tileY = tile.y;
			const idx = tile.index;
			s.wallLayer.removeTileAt(tileX, tileY);
			s.time.delayedCall(TIMEOUT_LONG, () => {
				const t = s.wallLayer.putTileAt(idx, tileX, tileY);
				t.setCollision(true);
			});
		}
	});

	// tiles.forEach(tile => {
		
		// if (tile && tile.index !== -1) {
			// console.log(tile);
			// tile.properties = {collides: false};
			// tile.setVisible(false);
			
		// }
	// });
	// m.scene.wallLayer.setCollisionByProperty({collides: true});
	// m.scene.time.delayedCall(TIMEOUT_LONG, () => {
		// tiles.forEach(tile => {
			// if (tile && tile.index !== -1) {
				// tile.properties = {collides: true};;
				// tile.setVisible(true);
			// }
		// });
		// m.scene.wallLayer.setCollisionByProperty({collides: true});
	// });
}

//Change the object's velocity based on the angle calculated (thanks ChatGPT)
export function setObjectVelocityAfterPortal(object, velRotation){
	// console.log("===============================");
	// console.log("Current velocity:");
	// console.log(object.body.velocity);

	//Convert angle to radians
	var angleRad = velRotation * Math.PI / 180;

	// console.log("Rotation: " + velRotation);

	// Get current velocity
	const currentVelocity = object.body.velocity;

	// Calculate new velocity using rotation matrix
	const newVelocityX = currentVelocity.x * Math.cos(angleRad) - currentVelocity.y * Math.sin(angleRad);
	const newVelocityY = currentVelocity.x * Math.sin(angleRad) + currentVelocity.y * Math.cos(angleRad);

	// Set new velocity
	object.setVelocity(newVelocityX, newVelocityY);

	// console.log("New velocity:");
	// console.log(object.body.velocity);
	// console.log("===============================");

	return object.body.velocity;
}

//Returns the x and y coordinates of where the portal should be placed or throws error if invalid
//Also returns orientation of the portal (horizontal or vertical)
//Return collision side as well; this is done here to indent the portal a bit out of the wall
export function portalPlacement(x, y, wall, wallLayer){
	const nearestWall = getNearestValidWall(x, y, wall, wallLayer);
	const collisionSide = getCollisionSide(x, y, wall);

	if(!nearestWall){
		throw new Error('Portal Cancel, no nearest wall');
	}
	if(!collisionSide){
		throw new error('Portal Cancel, no collision side detected');
	}

	//Determine if connection is horizontal or vertical
	if(wall.x == nearestWall.x){ // vertical
		if(wall.y > nearestWall.y){
			if(collisionSide == 'left'){
				return {x: (nearestWall.pixelX + nearestWall.width/2 - OFFSET_PORTAL_PLACE), 
						y: (nearestWall.pixelY + nearestWall.height),
						orientation: VERTICAL,
						collisionSide: collisionSide};
			}else if(collisionSide == 'right'){
				return {x: (nearestWall.pixelX + nearestWall.width/2 + OFFSET_PORTAL_PLACE), 
						y: (nearestWall.pixelY + nearestWall.height),
						orientation: VERTICAL,
						collisionSide: collisionSide};
			}
		}else{
			if(collisionSide == 'left'){
				return {x: (wall.pixelX + wall.width/2 - OFFSET_PORTAL_PLACE), 
						y: (wall.pixelY + wall.height),
						orientation: VERTICAL,
						collisionSide: collisionSide};
			}else if(collisionSide == 'right'){
				return {x: (wall.pixelX + wall.width/2 + OFFSET_PORTAL_PLACE), 
						y: (wall.pixelY + wall.height),
						orientation: VERTICAL,
						collisionSide: collisionSide};
			}
			
		}
	}else if(wall.y == nearestWall.y){ //horizontal
		if(wall.x > nearestWall.x){
			if(collisionSide == 'top'){
				return {x: (nearestWall.pixelX + nearestWall.width), 
						y: (nearestWall.pixelY + nearestWall.height/2 - OFFSET_PORTAL_PLACE),
						orientation: HORIZONTAL,
						collisionSide: collisionSide};
			}else if(collisionSide == 'bottom'){
				return {x: (nearestWall.pixelX + nearestWall.width), 
						y: (nearestWall.pixelY + nearestWall.height/2 + OFFSET_PORTAL_PLACE),
						orientation: HORIZONTAL,
						collisionSide: collisionSide};
			}
		}else{
			if(collisionSide == 'top'){
				return {x: (wall.pixelX + wall.width), 
						y: (wall.pixelY + nearestWall.height/2 - OFFSET_PORTAL_PLACE),
						orientation: HORIZONTAL,
						collisionSide: collisionSide};
			}else if(collisionSide == 'bottom'){
				return {x: (wall.pixelX + wall.width), 
						y: (wall.pixelY + nearestWall.height/2 + OFFSET_PORTAL_PLACE),
						orientation: HORIZONTAL,
						collisionSide: collisionSide};
			}
		}
	}else{
		throw new Error('Portal Cancel');
	}
}