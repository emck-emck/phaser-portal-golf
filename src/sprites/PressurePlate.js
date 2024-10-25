import Phaser from 'phaser';
import Bridge from './Bridge.js';
import DisappearingWall from './DisappearingWall.js';

export default class PressurePlate extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, code, ctrl) {
		//Phaser setup
        super(scene, x, y, 'pressureplate');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		this.scene = scene;
		this.code = code;
		this.ctrl = ctrl;
		this.isOn = false;
		this.timeOn = 0;
    }

    update() {
		if(this.isOn && Date.now() >= this.timeOn + 50){
			if(!this.scene.physics.overlap(this)){
				this.isOn = false;
				if(this.ctrl && this.ctrl.length){ //If ctrl is an array
					if(this.ctrl[0] instanceof Bridge){
						for(var i = 0; i < this.ctrl.length; i++){
							this.ctrl[i].disableBody(true, true); //Hide the bridge

							//Reactivate the water beneath the bridge
							const tileX = this.ctrl[i].scene.map.worldToTileX(this.ctrl[i].x);
							const tileY = this.ctrl[i].scene.map.worldToTileY(this.ctrl[i].y);
							const wTile = this.ctrl[i].scene.water.getTileAt(tileX, tileY);
							if(wTile){
								wTile.setCollision(true);
							}
						}
					}
					if(this.ctrl[0] instanceof DisappearingWall){
						for(var i = 0; i < this.ctrl.length; i++){
							this.ctrl[i].enableBody(false, this.ctrl[i].x, this.ctrl[i].y, true, true);
						}
					}
				}
			}
		}
    }

	objectOnPlate(pp, obj){		
		pp.isOn = true;
		pp.timeOn = Date.now();
		if(pp.ctrl && pp.ctrl.length){ //If ctrl is an array
			if(pp.ctrl[0] instanceof Bridge){
				for(var i = 0; i < pp.ctrl.length; i++){
					pp.ctrl[i].enableBody(false, pp.ctrl[i].x, pp.ctrl[i].y, true, true); //Display the bridge
					
					//Deactivate the water beneath the bridge
					const tileX = pp.ctrl[i].scene.map.worldToTileX(pp.ctrl[i].x);
					const tileY = pp.ctrl[i].scene.map.worldToTileY(pp.ctrl[i].y);
					const wTile = pp.ctrl[i].scene.water.getTileAt(tileX, tileY);
					if(wTile){
						wTile.setCollision(false);
					}
				}
				return false;
			}
			if(pp.ctrl[0] instanceof DisappearingWall){
				for(var i = 0; i < pp.ctrl.length; i++){
					pp.ctrl[i].disableBody(true, true);
				}
				return false;
			}

		}
	}
}