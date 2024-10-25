import {OFFSET_PORTAL_BALL} from './constants.js';

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

//Change the object's velocity based on the angle calculated (thanks ChatGPT)
export function setObjectVelocityAfterPortal(object, velRotation){
	console.log("===============================");
	console.log("Current velocity:");
	console.log(object.body.velocity);

	//Convert angle to radians
	var angleRad = velRotation * Math.PI / 180;

	console.log("Rotation: " + velRotation);

	// Get current velocity
	const currentVelocity = object.body.velocity;

	// Calculate new velocity using rotation matrix
	const newVelocityX = currentVelocity.x * Math.cos(angleRad) - currentVelocity.y * Math.sin(angleRad);
	const newVelocityY = currentVelocity.x * Math.sin(angleRad) + currentVelocity.y * Math.cos(angleRad);

	// Set new velocity
	object.setVelocity(newVelocityX, newVelocityY);

	console.log("New velocity:");
	console.log(object.body.velocity);
	console.log("===============================");

	return object.body.velocity;
}

/*
Horizontal + Horizontal -- X breaks
Vertical + Vertical -- Y breaks
Horizontal + Vertical -- X breaks
Vertical + Horizontal -- Y breaks
*/