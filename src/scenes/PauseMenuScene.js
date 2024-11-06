import {ASSET_FILEPATH_PAUSE} from '../utils/constants.js';
import PauseMenuListener from '../handlers/PauseMenuListener.js';

class PauseMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
    }

    preload() {
        this.load.image('pausebg', ASSET_FILEPATH_PAUSE + 'pause_bg.png');
        this.load.image('resumeButton', ASSET_FILEPATH_PAUSE + 'resume.png');
        this.load.image('quitButton', ASSET_FILEPATH_PAUSE + 'quit.png');
    }

    create() {
		//Load the background image so we can get image dimensions
		var background = new Image();
		background.src = ASSET_FILEPATH_PAUSE + 'pause_bg.png';
		background.onload = () => {
			//Set variables for item placement in scene
			const swidth = this.scale.width;
			const sheight = this.scale.height;
			const bwidth = background.width;
			const bheight = background.height;
			const bgx = (swidth - bwidth) / 2;
			const bgy = (sheight - bheight) / 2;

			//Add background image
			this.add.image(swidth/2, sheight/2, 'pausebg');

			//Menu title
			const textx = swidth/2;
			const texty = bgy + bheight * 0.25;
			const textStyle = {
				fontSize: '48px', 
				fill: '#ffffff'
			};
			this.add.text(textx, texty, 'Paused', textStyle).setOrigin(0.5);

			//Resume button
			const resumex = bgx + bwidth * 0.25;
			const resumey = bgy + bheight * 0.8;
			const resumeButton = this.add.image(resumex, resumey, 'resumeButton').setInteractive();
			resumeButton.on('pointerdown', this.resumeGame, this);
			
			//Quit button
			const quitx = bgx + bwidth * 0.75;
			const quity = bgy + bheight * 0.8;
			const quitButton = this.add.image(quitx, quity, 'quitButton').setInteractive();
			quitButton.on('pointerdown', this.quitGame, this);

			const listener = new PauseMenuListener(this);
		};
    }

	resumeGame(){
		this.scene.stop('PauseMenu');
        this.scene.resume('GameScene');
	}

	quitGame(){
		this.scene.stop('PauseMenu');
        this.scene.stop('GameScene');
		this.scene.start('MenuScene');
	}
}

export default PauseMenuScene;