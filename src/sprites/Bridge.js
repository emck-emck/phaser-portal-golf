export default class Bridge extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, code) {
		//Phaser setup
        super(scene, x, y, 'bridge');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		//Class variables
		this.scene = scene;
		this.code = code;
		this.tileBeneathIndex = -1;

		//Helper variable for pressure plates
		const tileX = this.scene.map.worldToTileX(x);
		const tileY = this.scene.map.worldToTileY(y);
		const t = this.scene.groundLayer.getTileAt(tileX, tileY);
		if(t){
			this.tileBeneathIndex = t.index;
		}
    }

    update() {
		
    }
}