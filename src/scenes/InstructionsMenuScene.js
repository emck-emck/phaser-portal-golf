import {ASSET_FILEPATH_INSTRUCTIONS, ASSET_FILEPATH_TXT} from '../utils/constants.js';
import MenuListener from '../handlers/MenuListener.js';

class InstructionsMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: 'InstructionsMenu' });
    }

    preload(){
		this.load.image('instructionsbg', ASSET_FILEPATH_INSTRUCTIONS + 'instructions_bg.png');
		this.load.text('instructions', ASSET_FILEPATH_TXT + 'gameInstructions.txt');
        this.load.image('backButton', ASSET_FILEPATH_INSTRUCTIONS + 'back.png');
    }

    create(){
		//Load the background image so we can get image dimensions
		var background = new Image();
		background.src = ASSET_FILEPATH_INSTRUCTIONS + 'instructions_bg.png';
		background.onload = () => {
			//Set variables for item placement in scene
			const swidth = this.scale.width;
			const sheight = this.scale.height;
			const bwidth = background.width;
			const bheight = background.height;
			const bgx = (swidth - bwidth) / 2;
			const bgy = (sheight - bheight) / 2;

			//Add background image
			this.add.image(swidth/2, sheight/2, 'instructionsbg');

			//Instructions text
			const instructionsText = this.cache.text.get('instructions');
			const textx = bgx + bwidth * 0.05;
			const texty = bgy + bheight * 0.1;
			const textStyle = {
				fontSize: '22px', 
				fill: '#ffffff', 
				align: 'left',
				wordWrap: { width: bwidth - 20 }
			};
			this.add.text(textx, texty, instructionsText, textStyle);

			//Back button
			const backx = swidth/2;
			const backy = bgy + bheight * 0.8;
			const backButton = this.add.image(backx, backy, 'backButton').setInteractive();
			backButton.on('pointerdown', () => {
				this.scene.resume('MenuScene');
				this.scene.stop('InstructionsMenu');
			});
			
			const listener = new MenuListener(this);
		};
    }
}

export default InstructionsMenuScene;