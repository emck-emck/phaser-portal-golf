import {ASSET_FILEPATH_MENU} from '../utils/constants.js';
import MenuListener from '../handlers/MenuListener.js';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
		this.load.image('menuScreen', ASSET_FILEPATH_MENU + 'start_bg.png');
        this.load.image('startButton', ASSET_FILEPATH_MENU + 'start_button.png');
        this.load.image('instructionsButton', ASSET_FILEPATH_MENU + 'instructions_button.png');
    }

    create() {
        this.add.image(this.scale.width/2,this.scale.height/2,'menuScreen');
        const startButton = this.add.image(this.scale.width/2, 437, 'startButton').setInteractive();
		const instructionsButton = this.add.image(this.scale.width/2, 537, 'instructionsButton').setInteractive();

        startButton.on('pointerdown', this.startGame, this);
		instructionsButton.on('pointerdown', this.instructions, this);

		const listener = new MenuListener(this);
    }

	startGame(){
		this.scene.start('GameScene', {holeId: 0, totalStrokes: 0});
		this.scene.stop('MenuScene');
	}

	instructions(){
		this.scene.launch('InstructionsMenu');
        this.scene.pause('MenuScene');
	}

}

export default MenuScene;