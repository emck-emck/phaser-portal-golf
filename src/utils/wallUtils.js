import Cube from '../sprites/Cube.js';

//Removes collision from walls with portals attached to them
export function setPortalWallColliders(wallLayer, portals){
	wallLayer.forEachTile(tile => {
		if(tile.index !== -1){
			var i;
			for(const [key, portal] of Object.entries(portals)){ //Loop throught the portals object
				if(Phaser.Geom.Rectangle.Overlaps(portal.getBounds(), tile.getBounds())){
					tile.setCollision(false);
					break;
				}else{
					tile.setCollision(true);
				}
			}
			
		}
	});
}

//Determines and returns what side of the wall the object hit
export function getCollisionSide(x, y, wall) {

	var wx = wall.pixelX + wall.width / 2;
	var wy = wall.pixelY + wall.height / 2;

	//Allows cubes to be considered walls
	if(wall instanceof Cube){
		wx = wall.body.center.x;
		wy = wall.body.center.y;
	}
	
	const dx = x - wx;
	const dy = y - wy;

	if (Math.abs(dx) > Math.abs(dy)) {
		if (dx > 0) {
			return 'right';
		} else {
			return 'left';
		}
	}else{
		if (dy > 0) {
			return 'bottom';
		} else {
			return 'top';
		}
	}
}

//Function used by createPortal() to find the other tile to attach the portal to
export function getNearestValidWall(x, y, wall, wallLayer){
	var wallx = wall.x;
	var wally = wall.y;
	var tileId = wall.index;
	var adjacentTiles = [];

	//Find adjacent walls horizontally and vertically
		//Check whether the wall is of the same type as the wall shot
	//Check left
	if(wallx > 0){
		var leftTile = wallLayer.getTileAt(wallx - 1, wally);
		if (leftTile && leftTile.index === tileId ){
			adjacentTiles.push(leftTile);
		}
	}
	//Check right
	if(wallx < wallLayer.layer.width - 1){
		var rightTile = wallLayer.getTileAt(wallx + 1, wally);
		if (rightTile && rightTile.index === tileId){
			adjacentTiles.push(rightTile);
		}
	}

	//Check up
	if(wally > 0){
		var upTile = wallLayer.getTileAt(wallx, wally - 1);
		if (upTile && upTile.index === tileId){
			adjacentTiles.push(upTile);
		}
	}

	//Check down
	if(wally < wallLayer.layer.height - 1){
		var downTile = wallLayer.getTileAt(wallx, wally + 1);
		if (downTile && downTile.index === tileId){
			adjacentTiles.push(downTile);
		}
	}

	//Determine which valid adjacent wall is nearest to the x and y
	if(adjacentTiles.length > 0){
		var ret = adjacentTiles[0];
		
		//Measurement Variables
		var wallCenterX;
		var wallCenterY;
		var dx;
		var dy;
		var distance;
		var near = null;
		for(var i = 0; i < adjacentTiles.length; i++){
			wallCenterX = adjacentTiles[i].pixelX + adjacentTiles[i].width / 2;
			wallCenterY = adjacentTiles[i].pixelY + adjacentTiles[i].height / 2;
			dx = wallCenterX - x;
			dy = wallCenterY - y;
			distance = Math.sqrt(dx**2 + dy**2);
			if(near == null || distance < near){
				near = distance;
				ret = adjacentTiles[i];
			}
		}
		return ret;
	}else{
		return null;
	}
}