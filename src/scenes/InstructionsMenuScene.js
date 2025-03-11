import {ASSET_FILEPATH_INSTRUCTIONS, ASSET_FILEPATH_TXT} from '../utils/constants.js';
import MenuListener from '../handlers/MenuListener.js';

class InstructionsMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: 'InstructionsMenu' });
    }

    preload(){
		this.load.text('instructions', ASSET_FILEPATH_TXT + 'instructions.txt');

		this.load.image('instructionsbg', ASSET_FILEPATH_INSTRUCTIONS + 'instructions_bg.png');
        this.load.image('nextButton', ASSET_FILEPATH_INSTRUCTIONS + 'next.png');
        this.load.image('prevButton', ASSET_FILEPATH_INSTRUCTIONS + 'prev.png');
        this.load.image('backButton', ASSET_FILEPATH_INSTRUCTIONS + 'back.png');
    }

    create(){
		//Load the background image so we can get image dimensions
		var background = new Image();
		background.src = ASSET_FILEPATH_INSTRUCTIONS + 'instructions_bg.png';

		this.page = 0;
		var rawText = this.cache.text.get('instructions');

		//avoids newline issues
		// Normalize line endings: Convert all \r\n (Windows) to \n (Unix-like)
        rawText = rawText.replace(/\r\n/g, '\n');
        // Split the text into pages using "---" (ignoring newlines around it)
        this.pages = rawText ? rawText.split(/\n?---\n?/) : ["No instructions available."];

		background.onload = () => {
			//Set variables for item placement in scene
			const swidth = this.scale.width;
			const sheight = this.scale.height;
			const bwidth = background.width;
			const bheight = background.height;
			const bgx = (swidth - bwidth) / 2;
			const bgy = (sheight - bheight) / 2;
			const borderwidth = 5;

			//Add background image
			this.add.image(swidth/2, sheight/2, 'instructionsbg');

			//Instructions text
			const instructionsText = this.cache.text.get('instructions1');
			const textx = bgx + bwidth/2 + borderwidth;
			const texty = bheight - bgy/2;
			const textStyle = {
				fontSize: '22px', 
				fill: '#ffffff', 
				align: 'center',
				wordWrap: { width: bwidth - borderwidth }
			};
			this.txt = this.add.text(textx, texty, this.pages[this.page], textStyle).setOrigin(0.5);

			//Next/Prev buttons
			const nextx = swidth/2 + 100;
			const nexty = bgy + bheight * 0.65;
			const prevx = swidth/2 - 100;
			const prevy = bgy + bheight * 0.65;

			this.nextButton = this.add.image(nextx, nexty, 'nextButton').setInteractive();
			this.nextButton.on('pointerdown', () => this.changePage(1), this);
			this.prevButton = this.add.image(prevx, prevy, 'prevButton').setInteractive();
			this.prevButton.on('pointerdown', () => this.changePage(-1), this);
			
			//Back button
			const backx = swidth/2;
			const backy = bgy + bheight * 0.8;
			const backButton = this.add.image(backx, backy, 'backButton').setInteractive();
			backButton.on('pointerdown', this.back, this);
			
			this.changePage(0)
			const listener = new MenuListener(this);
		};
    }

	back(){
		this.scene.resume('MenuScene');
		this.scene.stop('InstructionsMenu');
	}

	changePage(direction){
		this.page = this.page + direction;
		this.txt.setText(this.pages[this.page]);

		this.nextButton.setVisible(this.page < this.pages.length - 1);
		this.prevButton.setVisible(this.page > 0);
	}

}

export default InstructionsMenuScene;