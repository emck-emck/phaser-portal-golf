import {ASSET_FILEPATH_LEVEL_SELECT, MAP_INFO} from '../utils/constants.js';
import MenuListener from '../handlers/MenuListener.js';

class LevelSelectScene extends Phaser.Scene {
    constructor(){
        super({ key: 'LevelSelect' });
    }

    preload(){
		
    }

    create(){
		this.page = 0;
		this.perPage = 6;


		fetch('./html/levelselect.html')
			.then(response => response.text())
			.then(html => {
				let div = document.createElement('div');
				div.innerHTML = html;
				div.id = "levelselect";
				document.getElementById("gameWrapper").appendChild(div);

				let backBtn = document.getElementById('back');
				if (backBtn) {
					backBtn.addEventListener('click', this.back.bind(this));
				}
				let nextBtn = document.getElementById('next');
				if (nextBtn) {
					nextBtn.addEventListener('click', () => {
						this.page = this.page + 1;
						this.changePage();
					});
				}
				let prevBtn = document.getElementById('prev');
				if (prevBtn) {
					prevBtn.addEventListener('click', () => {
						this.page = this.page - 1;
						this.changePage();
					});
				}

				document.getElementById("levelselect").addEventListener("click", e => {
					if (e.target.tagName === "IMG") {
						const levelID = e.target.id;
						this.playHole(levelID);
					}
				});

				this.changePage();
			})
			.catch(error => console.error('Error loading overlay:', error));
    }

	back(){
		let overlay = document.getElementById('levelselect');
		if (overlay) {
			overlay.remove();
		}

		this.scene.resume('MenuScene');
		this.scene.stop('LevelSelect');
	}

	changePage(){
		var contentDiv = document.getElementById('overlay-content');
		var start = this.page * this.perPage;
		var end = start + this.perPage;
		var levels = MAP_INFO.slice(start, end);
		
		contentDiv.innerHTML = "";

		for(var i = 0; i < levels.length; i++){
			var d = document.createElement('div');
			var imgName = ASSET_FILEPATH_LEVEL_SELECT + levels[i].name + '.png';
			var holeIdx = i + start;
			d.innerHTML = `<img id="${holeIdx}" src="${imgName}"/>`;
			contentDiv.appendChild(d);
		}

		let nextBtn = document.getElementById('next');
		if (nextBtn) {
			nextBtn.style.display = (((this.page + 1) * this.perPage) < MAP_INFO.length ? "block" : "none");
		}
		let prevBtn = document.getElementById('prev');
		if (prevBtn) {
			prevBtn.style.display = (this.page > 0 ? "block" : "none");
		}
	}

	playHole(id){
		let overlay = document.getElementById('levelselect');
		if (overlay) {
			overlay.remove();
		}

		this.scene.start('GameScene', {holeId: id, totalStrokes: 0, totalTime: 0, isFullGame: false});
		this.scene.stop('MenuScene');
		this.scene.stop('LevelSelect');
	}
}

export default LevelSelectScene;