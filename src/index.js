//Imports
import Phaser from 'phaser';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from './utils/constants.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import WinScene from './scenes/WinScene.js';
import InstructionsMenuScene from './scenes/InstructionsMenuScene.js';
import PauseMenuScene from './scenes/PauseMenuScene.js';

//Magic Phaser3 Configuration Stuff
const config = {
	parent: 'game-container',
	type: Phaser.AUTO,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	scale: {
        mode: Phaser.Scale.FIT,   // Ensures the game scales to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centers the game
    },
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            fps: 120,  // Target FPS
            timeScale: 1, // Scale of the physics time, 1 is normal speed
            maxPhysicsSteps: 1, // Max number of physics steps per frame
        }
    },
	scene: [MenuScene, GameScene, WinScene, InstructionsMenuScene, PauseMenuScene]
};

//RUNS THE GAME
const game = new Phaser.Game(config);