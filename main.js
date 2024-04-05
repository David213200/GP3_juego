import './style.css'
import Phaser from 'phaser'
import config from './config';
import GameScene from '/scenes/GameScene';

export const game = new Phaser.Game({ ...config, scene: [GameScene] });


