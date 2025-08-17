import MenuListener from '../handlers/MenuListener.js';
import {ASSET_FILEPATH_LEADERBOARD} from '../utils/constants.js';

class LeaderboardScene extends Phaser.Scene {
    constructor(){
        super({ key: 'Leaderboard' });
    }

    preload(){
		this.load.image('leaderbordScreen', ASSET_FILEPATH_LEADERBOARD + 'leaderboard_bg.png');
    }

    create(){
		const s = this;

		//Set variables for item placement in scene
		const swidth = this.scale.width;
		const sheight = this.scale.height;
		const borderwidth = 5;

		//Add background image
		this.add.image(swidth/2, sheight/2, 'leaderbordScreen');

		//Load the leaderboard HTML
		fetch('./html/leaderboard.html')
			.then(response => response.text())
			.then(html => {
				let div = document.createElement('div');
				div.innerHTML = html;
				div.id = "leaderboard";
				document.body.appendChild(div);

				fetch('https://pg-leaderboard-worker.portal-golf.workers.dev/topten?page=0')
					.then(r => r.json())
					.then(data => {
						var scores = data.scores;
						var scoresObj = document.getElementById('scores');
						var append = '';
						for(var i = 0; i < scores.length; i++){
							append = append + "<tr>";
							append = append + "<td>" + scores.rank + "</td>";
							append = append + "<td>" + scores.name + "</td>";
							append = append + "<td>" + scores.putt + "</td>";
							append = append + "<td>" + scores.time + "</td>";
							append = append + "<td>" + scores.date + "</td>";
							append = append + "</tr>";
						}
						scoresObj.innerHTML = append;
					})
					.catch(error => console.error('Error fetching leaderboard:', error));


				let button = document.getElementById('back');
				if (button) {
					button.addEventListener('click', () => {
						back(s);
					});
				}
			})
			.catch(error => console.error('Error loading overlay:', error));

		const listener = new MenuListener(this);
    }
}

function back(scene){
	let overlay = document.getElementById('leaderboard');
	if (overlay) {
		overlay.remove();
	}

	scene.scene.resume('MenuScene');
	scene.scene.stop('Leaderboard');
}

export default LeaderboardScene;