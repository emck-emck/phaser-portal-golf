import Bridge from './Bridge.js';
import DisappearingWall from './DisappearingWall.js';

export default class PressurePlate extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, code) {
		//Phaser setup
        super(scene, x, y, 'pressureplate');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		this.scene = scene;
		this.code = code;
		this.ctrl = [];
		this.isOn = false;
		this.timeOn = 0;
    }

    update() {
		if(this.isOn && Date.now() >= this.timeOn + 50){
			if(!this.scene.physics.overlap(this)){
				this.isOn = false;
				if(this.ctrl && this.ctrl.length){ //If ctrl is an array
					for(var i = 0; i < this.ctrl.length; i++){
						if(this.ctrl[i] instanceof Bridge){
							this.ctrl[i].disableBody(true, true); //Hide the bridge

							//Reactivate the water beneath the bridge
							const tileX = this.ctrl[i].scene.map.worldToTileX(this.ctrl[i].x);
							const tileY = this.ctrl[i].scene.map.worldToTileY(this.ctrl[i].y);
							const tile = this.ctrl[i].scene.groundLayer.getTileAt(tileX, tileY);
							if(!tile){
								this.scene.groundLayer.putTileAt(this.ctrl[i].tileBeneathIndex, tileX, tileY);
							}
						}
						if(this.ctrl[i] instanceof DisappearingWall){
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
			for(var i = 0; i < pp.ctrl.length; i++){
				if(pp.ctrl[i] instanceof Bridge){
					pp.ctrl[i].enableBody(false, pp.ctrl[i].x, pp.ctrl[i].y, true, true); //Display the bridge
					
					//Deactivate the water beneath the bridge
					const tileX = pp.ctrl[i].scene.map.worldToTileX(pp.ctrl[i].x);
					const tileY = pp.ctrl[i].scene.map.worldToTileY(pp.ctrl[i].y);
					const tile = pp.ctrl[i].scene.groundLayer.getTileAt(tileX, tileY);
					if(tile){
						pp.scene.groundLayer.removeTileAt(tileX, tileY);
					}
				}
				if(pp.ctrl[i] instanceof DisappearingWall){
					pp.ctrl[i].disableBody(true, true);
				}
			}
		}
		return false;
	}
}