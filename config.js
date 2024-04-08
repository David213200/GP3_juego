import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import initialScene from './scenes/index';
import GameOverScene from './scenes/GameOverScene';


const speedDown = 0

const config = {
    type: Phaser.WEBGL,
    width: 1500,
    height: 700,
    canvas: gameCanvas,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: speedDown },
        debug: false
      }
    },
    scene: [initialScene, GameScene, GameOverScene]
  }

export default config;