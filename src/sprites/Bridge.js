import Phaser from 'phaser';

export default class Bridge extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, code) {
		//Phaser setup
        super(scene, x, y, 'bridge');
        scene.add.existing(this);
        scene.physics.add.existing(this);

		this.scene = scene;
		this.code = code;
    }

    update() {
		
    }
}