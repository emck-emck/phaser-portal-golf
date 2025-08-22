import {ASSET_FILEPATH_INSTRUCTIONS, ASSET_FILEPATH_TXT} from '../utils/constants.js';
import MenuListener from '../handlers/MenuListener.js';
import {fixAssetPaths} from '../utils/utils.js';

class InstructionsMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: 'InstructionsMenu' });
    }

    preload(){
		
    }

    create(){
		this.page = 0;
		this.pages = [];
		
		//Load the leaderboard HTML
		fetch('./html/instructions.html')
			.then(response => response.text())
			.then(html => {
				let div = document.createElement('div');
				div.innerHTML = html;
				div.id = "instructions";
				document.getElementById("gameWrapper").appendChild(div);

				this.pages = document.querySelectorAll(".page");
				fixAssetPaths(document.getElementById('instructions'));

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

				this.changePage();
			})
			.catch(error => console.error('Error loading overlay:', error));
    }

	back(){
		let overlay = document.getElementById('instructions');
		if (overlay) {
			overlay.remove();
		}

		this.scene.resume('MenuScene');
		this.scene.stop('InstructionsMenu');
	}

	changePage(){
		this.pages.forEach((p, i) => p.style.display = i === this.page ? "block" : "none");

		let nextBtn = document.getElementById('next');
		if (nextBtn) {
			nextBtn.style.display = (this.page < this.pages.length - 1 ? "block" : "none");
		}
		let prevBtn = document.getElementById('prev');
		if (prevBtn) {
			prevBtn.style.display = (this.page > 0 ? "block" : "none");
		}
	}

}

export default InstructionsMenuScene;