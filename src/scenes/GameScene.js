import Phaser from 'phaser';

import Listener from '../handlers/Listener.js';

//Sprite class import
import Ball from '../sprites/Ball.js';
import Bridge from '../sprites/Bridge.js';
import Cube from '../sprites/Cube.js';
import DisappearingWall from '../sprites/DisappearingWall.js';
import Goal from '../sprites/Goal.js';
import MovingWall from '../sprites/MovingWall.js';
import Portal from '../sprites/Portal.js';
import PortalP from '../sprites/PortalP.js';
import PressurePlate from '../sprites/PressurePlate.js';

//Util import
import {ASSET_FILEPATH_GAME, ASSET_FILEPATH_GAME_MAP, BALL_FORCE_MULTIPLIER, MAX_BALL_SPEED, MENU_BAR_HEIGHT, MENU_FONT_SIZE, MWALL_SPEED} from '../utils/constants.js'
import {MAP_INFO} from '../utils/constants.js';



class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
		//Objects
		this.ball = null;
		this.walls = null;
		this.iWalls = null;
		this.portalGroup = null;
		this.ppGroup = null;

		//Menu bar items
		this.powerBar = null;
		this.indicator = null;
		this.parText = null;
		this.strokesText = null;
		this.strokes = 0;

		//Helper
		this.powerBarActive = false;
    }

	init(data){
		this.holeId = data.holeId;
		this.totalStrokes = data.totalStrokes;
		this.holeName = MAP_INFO[data.holeId].name;
		this.par = MAP_INFO[data.holeId].par;
	}

    preload() {
        //Maps
		this.load.tilemapTiledJSON(this.holeName, ASSET_FILEPATH_GAME_MAP + this.holeName + '.json');
	
		//Tiles
		this.load.image('ground', ASSET_FILEPATH_GAME +  'bg_tile.png');
		this.load.image('water', ASSET_FILEPATH_GAME +  'water.png');
		this.load.image('sand', ASSET_FILEPATH_GAME +  'sand.png');
		this.load.image('wall', ASSET_FILEPATH_GAME +  'wall.png');
		this.load.image('inactivewall', ASSET_FILEPATH_GAME +  'inactivewall.png');
	
		//Sprites
		//Game bar objects
		this.load.image('powerbar', ASSET_FILEPATH_GAME +  'powerbar.png');
		this.load.image('indicator', ASSET_FILEPATH_GAME +  'indicator.png');
		//Game objects
		this.load.image('ball', ASSET_FILEPATH_GAME +  'ball.png');
		this.load.image('cube', ASSET_FILEPATH_GAME +  'cube.png');
		this.load.image('disappearingwall', ASSET_FILEPATH_GAME +  'disappearingwall.png');
		this.load.image('goal', ASSET_FILEPATH_GAME +  'goal.png');
		this.load.image('pressureplate', ASSET_FILEPATH_GAME +  'pressureplate.png');
		this.load.image('bridge', ASSET_FILEPATH_GAME +  'bridge.png');
		//Portal objects
		this.load.image('bportalp', ASSET_FILEPATH_GAME + 'blueportalprojectile.png');
		this.load.image('oportalp', ASSET_FILEPATH_GAME + 'orangeportalprojectile.png');
		this.load.image('bportalh', ASSET_FILEPATH_GAME + 'blueportalwallh.png');
		this.load.image('oportalh', ASSET_FILEPATH_GAME + 'orangeportalwallh.png');
		this.load.image('bportalv', ASSET_FILEPATH_GAME + 'blueportalwallv.png');
		this.load.image('oportalv', ASSET_FILEPATH_GAME + 'orangeportalwallv.png');
    }

    create() {
        //Tiled Init
		//Make map
		this.map = this.make.tilemap({key: this.holeName});
		//Tile layers
		this.wallLayer = null;
		this.groundLayer = null;
		//Tilesets
		this.groundTile = -1;
		this.waterTile = -1;
		this.sandTile = -1;
		this.wallTile = -1;
		this.iWallTile = -1;
		this.fakeWall = -1;

		//Check tile layers, load if we have them
		//ground
		const groundLayer = this.map.getLayer('Ground_Layer');
		if(groundLayer){
			//Connect images to tiles
			this.groundTile = this.map.addTilesetImage('Ground', 'ground');
			this.waterTile = this.map.addTilesetImage('Water', 'water');
			this.sandTile = this.map.addTilesetImage('Sand', 'sand');
			this.fakeWall = this.map.addTilesetImage('Wall', 'wall');
			//Create layer
			this.groundLayer = this.map.createLayer('Ground_Layer', [this.groundTile, this.waterTile, this.sandTile, this.fakeWall], 0, 0);
			this.groundLayer.setCollisionByExclusion([-1]);
			//Tile object init
			this.groundLayer.forEachTile((tile) => {
				if(tile.tileset === this.waterTile){
					
				}else if(tile.tileset === this.sandTile){
					
				}
			});

		}
		//walls
		const wallLayer = this.map.getLayer('Wall_Layer');
		if(wallLayer){
			//Connect images to tiles
			this.wallTile = this.map.addTilesetImage('Wall', 'wall');
			this.iWallTile = this.map.addTilesetImage('Inactive_Wall', 'inactivewall');
			//Create layer
			this.wallLayer = this.map.createLayer('Wall_Layer', [this.wallTile, this.iWallTile], 0, 0);
			this.wallLayer.setCollisionByProperty({collides: true});
			//Tile object init
			this.wallLayer.forEachTile((tile) => {
				if(tile.tileset === this.wallTile){
					
				}else if(tile.tileset === this.iWallTile){
					
				}
			});
			 // Enable debug rendering for the tile layer
			//this.debugGraphics = this.add.graphics().setAlpha(0.75);
			//this.debugWall();
		}

		//Find Object Positions
		const ballObject = this.map.findObject('Ball_Layer', obj => obj.name === 'Ball_Object');
		const goalObject = this.map.findObject('Goal_Layer', obj => obj.name === 'Goal_Object');
		const objectLayer = this.map.getObjectLayer('Object_Layer');

		//Menu bar
		this.createMenuBar();
		this.strokes = 0;
	
		//Collider group init
		this.ppGroup = this.physics.add.group();
		this.portalGroup = this.physics.add.group();
		this.cubeGroup = this.physics.add.group();
		this.movingWallGroup = this.physics.add.group();
		this.pressurePlateGroup = this.physics.add.group();
		this.disappearingWallGroup = this.physics.add.group();
		this.bridgeGroup = this.physics.add.group();
	
		//Object Init
		//Goal
		if(goalObject){
			this.goal = new Goal(this, goalObject.x, goalObject.y);
			this.goal.setDepth(0);
		}else{
			throw new error('Goal not initialized');
		}

		//Ball
		if(ballObject){
			//Create Ball object
			this.ball = new Ball(this, ballObject.x, ballObject.y);
			this.ball.setDepth(1);
		}else{
			throw new error('Ball not initialized');
		}

		//Every other static object
		if(objectLayer){
			var i = 1;
			objectLayer.objects.forEach(object => {
				let type = object.properties.find(prop => prop.name === 'type').value;
				var code;
				switch (type) {
					case 'cube':
						// Cube init
						const cube = new Cube(this, object.x, object.y);
						this.cubeGroup.add(cube);
						cube.setImmovable(false);
						cube.pushable = false;
						cube.setMass(0.5);
						cube.setDepth(1);
						break;
					case 'mwall':
						// mWall init
						var isHorizontal = true;
						if(object.properties.find(prop => prop.name === 'horizontal')){
							isHorizontal = object.properties.find(prop => prop.name === 'horizontal').value;
						}
						const mWall = new MovingWall(this, object.x, object.y, MWALL_SPEED, isHorizontal);

						this.movingWallGroup.add(mWall);
						mWall.setVel();
						mWall.setImmovable(true);
						mWall.body.pushable = false;
						mWall.body.setDamping(false);
						mWall.setDepth(1);
						break;
					case 'dwall':
						// dWall init
						code = object.properties.find(prop => prop.name === 'code').value;
						const dw = new DisappearingWall(this, object.x, object.y, code);
						this.disappearingWallGroup.add(dw);
						dw.setImmovable(true);
						dw.body.pushable = false;
						break;
					case 'bridge':
						code = object.properties.find(prop => prop.name === 'code').value;
						const b = new Bridge(this, object.x, object.y, code);
						this.bridgeGroup.add(b);
						b.setImmovable(true);
						b.body.pushable = false;
						b.disableBody(true, true);
						break;
					case 'press':
						// Pressure pate init	
						code = object.properties.find(prop => prop.name === 'code').value;
						const press = new PressurePlate(this, object.x, object.y, code);
						this.pressurePlateGroup.add(press);
						press.setImmovable(true);
						press.setDepth(0);
						break;
					default:
						console.warn('Unknown object type: ${object.properties.type}');
				}
			});
		}

		//Link pressure plates to objects
		this.pressurePlateGroup.children.iterate((press) => {
			if (press) {
				var objs = [];
				const code = press.code;
				//Finds the objects corresponding with this plate
				this.disappearingWallGroup.children.iterate((dw) => {
					if (dw) {
						if(dw.code == code){
							objs.push(dw);
						}
					}
				});
				this.bridgeGroup.children.iterate((b) => {
					if(b){
						if(b.code == code){
							objs.push(b);
						}
					}
				});
				press.ctrl = objs;
			}
		});
	
		//Collider init
		//Hazard collision handled in friction function

		//Ball colliders
		this.physics.add.collider(this.ball, this.wallLayer, this.ball.wallCollision);
		this.physics.add.collider(this.ball, this.goal, null, this.goal.handleBallAtGoal.bind(this));
		this.physics.add.collider(this.ball, this.portalGroup, null, this.ball.portalCollision);

		//Portal colliders
		this.physics.add.collider(this.ppGroup, this.portalGroup, null, this.ppPortalCollision);
		this.physics.add.collider(this.portalGroup, this.portalGroup, this.portalPortalCollision.bind(this));


		//Cube colliders
		this.cubeGroup.children.iterate((c) => {
			if (c) {
				this.physics.add.collider(c, this.wallLayer, c.wallCollision);
				this.physics.add.collider(c, this.ball, c.ballCollision, c.preBallCollision, this);
				this.physics.add.collider(c, this.ppGroup, null, c.PPCollision);
				this.physics.add.collider(c, this.portalGroup, null, c.portalCollision);
				this.physics.add.collider(c, this.movingWallGroup, null, c.movingWallCollision);
				this.physics.add.collider(c, this.disappearingWallGroup, c.wallCollision);
				this.physics.add.collider(c, this.cubeGroup);
			}
		});

		//Moving Wall Colliders
		this.movingWallGroup.children.iterate((m) => {
			if (m) {
				this.physics.add.collider(m, this.wallLayer, null, m.wallCollision);
				this.physics.add.collider(m, this.ball, m.ballCollision);
				this.physics.add.collider(m, this.ppGroup, null, m.PPCollision);
				this.physics.add.collider(m, this.portalGroup, null, m.portalCollision);
				this.physics.add.collider(m, this.cubeGroup, null, m.wallCollision);
				this.physics.add.collider(m, this.movingWallGroup, m.wallCollision);
				this.physics.add.collider(m, this.disappearingWallGroup, null, m.wallCollision);
			}
		});

		//Pressure Plate Colliders
		this.pressurePlateGroup.children.iterate((press) => {
			if (press) {
				this.physics.add.collider(press, this.ball, null, press.objectOnPlate);
				this.physics.add.collider(press, this.cubeGroup, null, press.objectOnPlate);
				this.physics.add.collider(press, this.movingWallGroup, null, press.objectOnPlate);
			}
		});

		//Disappearing Wall Colliders
		this.disappearingWallGroup.children.iterate((dw) => {
			if (dw) {
				this.physics.add.collider(dw, this.ball);
			}
		});
	
		//Player input init
		var listener = new Listener(this);

		// Post update listener
		this.events.on('postupdate', this.postUpdate.bind(this));
	}
	
	update() {

		//Ball motion
		this.ball.update();
		//Cube motion
		this.cubeGroup.children.iterate((c) => {
			if (c) {
				c.update();
			}
		});
		//Pressure plate detect
		this.pressurePlateGroup.children.iterate((press) => {
			if (press) {
				press.update();
			}
		});
		//Moving wall update
		this.movingWallGroup.children.iterate((m) => {
			if(m){
				m.update();
			}
		});

		//Menu bar update
		this.strokesText.setText('Strokes: ' + this.strokes);
		this.parText.setText('Par: ' + this.par);
		//Power bar update
		if(this.powerBarActive){
			this.handlePowerBar(this.ball.mouseDownCoords.x, 
								this.ball.mouseDownCoords.y, 
								this.input.activePointer.worldX, 
								this.input.activePointer.worldY);
		}else{
			this.powerBar.setVisible(false);
		}
		//Indicator update
		if(this.ball.isBallMoving()){
			this.indicator.setVisible(false);
		}else{
			this.indicator.setVisible(true);
		}
	}

	postUpdate(time, delta){
		this.ball.postUpdate();
	}

	ppPortalCollision(pp, portal){
		pp.destroy();
		return false;
	}

	portalPortalCollision(p1, p2){
		Portal.destroyByProperty(this, p2.key);
	}

	createMenuBar() {
        //Create a rectangle to serve as the background of the menu bar
        this.add.rectangle(0, 0, this.cameras.main.width, MENU_BAR_HEIGHT, 0x000000).setOrigin(0, 0);

		//Power bar
		this.powerBar = this.add.sprite(300, 300, 'powerbar');
		this.powerBar.setOrigin(0, 0.5);
		this.powerBar.setDepth(3);
		this.powerBar.setVisible(false);

		//Shooting Indicator
		this.indicator = this.add.sprite(850, 32, 'indicator');

		//Hole Information
        this.strokesText = this.add.text(10, 10, 'Strokes: 0', { fontSize: MENU_FONT_SIZE, fill: '#fff' });
        this.parText = this.add.text(10, 34, 'Par: ' + this.par, { fontSize: MENU_FONT_SIZE, fill: '#fff' });

        // Ensure the menu bar is always on top
        this.children.bringToTop(this.scoreText);
        this.children.bringToTop(this.livesText);
    }

	handlePowerBar(x1, y1, x2, y2){
		const forcex = x2 - x1;
		const forcey = y2 - y1;
	
		//Get potential shot force
		var force = (Math.sqrt(forcex**2 + forcey**2)*BALL_FORCE_MULTIPLIER);
		if(force > MAX_BALL_SPEED){
			force = MAX_BALL_SPEED;
		}
		
		//Get angle of shot
		var angle = Math.atan2(forcey, forcex);

		this.powerBar.x = x1;
		this.powerBar.y = (y1 + (this.powerBar.height/2));
		this.powerBar.angle = (angle * (180 / Math.PI));

		this.updateCrop(force/MAX_BALL_SPEED);
	}

	updateCrop(powerPercentage) {
		this.powerBar.setVisible(true);
        this.powerBar.setCrop(0, 0, this.powerBar.width * powerPercentage, this.powerBar.height);
    }

	// Delete me when you're ready
	debugWall(){
		this.debugGraphics.clear();
		this.walls.renderDebug(this.debugGraphics, {
			tileColor: null, // Color of non-colliding tiles
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of the colliding face edges
		});
	}
}

export default GameScene;
