export default class DisappearingWall extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, code) {
		//Phaser setup
        super(scene, x, y, 'disappearingwall');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		this.scene = scene;
		this.code = code;
    }

    update() {
		
    }

	ppCollision(dw, pp){
		pp.destroy();
		return false;
	}
}