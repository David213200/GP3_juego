import Phaser from 'phaser';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload(): void {
    // TODO
  }

  create(): void {
    // TODO
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 800,
    height: 600,
  },
  backgroundColor: '#5c5b5b',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
