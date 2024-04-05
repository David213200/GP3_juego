import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import initialScene from './scenes/index';


const speedDown = 0

const config = {
    type: Phaser.WEBGL,
    width: "98%",
    height: "98%",
    canvas: gameCanvas,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: speedDown },
        debug: false
      }
    },
    scene: [GameScene]
  }

export default config;