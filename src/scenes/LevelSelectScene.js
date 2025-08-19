import {ASSET_FILEPATH_LEVEL_SELECT, MAP_INFO} from '../utils/constants.js';
import MenuListener from '../handlers/MenuListener.js';

class LevelSelectScene extends Phaser.Scene {
    constructor(){
        super({ key: 'LevelSelect' });
    }

    preload(){
		this.load.image('levelselectbg', ASSET_FILEPATH_LEVEL_SELECT + 'level_select_bg.png');
        this.load.image('nextButton', ASSET_FILEPATH_LEVEL_SELECT + 'next.png');
        this.load.image('prevButton', ASSET_FILEPATH_LEVEL_SELECT + 'prev.png');
        this.load.image('backButton', ASSET_FILEPATH_LEVEL_SELECT + 'back.png');
		for(var i = 0; i < MAP_INFO.length; i++){
			this.load.image(i.toString(), ASSET_FILEPATH_LEVEL_SELECT + MAP_INFO[i].name + '.png');
		}
		this.load.image('blank', ASSET_FILEPATH_LEVEL_SELECT + 'blank.png');
    }

    create(){
		const textStyle = {
			fontSize: '36px', 
			fill: '#ffffff'
		};

		//Load the background image so we can get image dimensions
		var background = new Image();
		background.src = ASSET_FILEPATH_LEVEL_SELECT + 'level_select_bg.png';

		this.imgs = [];
		this.page = 0;

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
			this.add.image(swidth/2, sheight/2, 'levelselectbg');

			//Add page title
			this.add.text(swidth/2, bgy + bheight * 0.1, "Level Select", textStyle).setOrigin(0.5, 0.5);

			//Add level select display
			var imgY = bgy + bheight * 0.3;
			var imgX;
			for(var i = 0; i < 2; i++){
				imgX = swidth/2 - 250;
				for(var j = 0; j < 3; j++){
					var temp = this.add.image(imgX, imgY,(j + (i*3)).toString());
					temp.setScale(0.3);
					temp.setInteractive();
					temp.setData({type: 'img', imgid: (j + (i*3))});
					this.imgs.push(temp);
					imgX = imgX + 250;
				}
				imgY = imgY + 175;
			}

			// Image listener
			this.input.on('gameobjectdown', this.playHole, this);

			//Next/Prev buttons
			const nextx = swidth/2 + 200;
			const nexty = bgy + bheight * 0.9;
			const prevx = swidth/2 - 200;
			const prevy = bgy + bheight * 0.9;

			this.nextButton = this.add.image(nextx, nexty, 'nextButton').setInteractive();
			this.nextButton.on('pointerdown', () => this.changePage(1), this);
			this.prevButton = this.add.image(prevx, prevy, 'prevButton').setInteractive();
			this.prevButton.on('pointerdown', () => this.changePage(-1), this);
			
			//Back button
			const backx = swidth/2;
			const backy = bgy + bheight * 0.9;
			const backButton = this.add.image(backx, backy, 'backButton').setInteractive();
			backButton.on('pointerdown', this.back, this);
			
			this.changePage(0);
			const listener = new MenuListener(this);
		};
    }

	back(){
		this.scene.resume('MenuScene');
		this.scene.stop('LevelSelect');
	}

	changePage(direction){
		this.page = this.page + direction;

		this.nextButton.setVisible(this.page < Math.floor(MAP_INFO.length/6));
		this.prevButton.setVisible(this.page > 0);

		for(var i = 0; i < this.imgs.length; i++){
			var g = (this.page*6) + i;
			if(g < MAP_INFO.length){
				this.imgs[i].setTexture(g.toString());
			}else{
				this.imgs[i].setTexture('blank');
			}
		}
	}

	playHole(pointer, obj){
		if(obj.data && obj.texture){
			if(obj.texture.key != 'blank'){
				var h = (this.page*6) + obj.getData('imgid');
				this.scene.start('GameScene', {holeId: h, totalStrokes: 0, totalTime: 0, isFullGame: false});
				this.scene.stop('MenuScene');
				this.scene.stop('LevelSelect');
			}
		}
	}
}

export default LevelSelectScene;