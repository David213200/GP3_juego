import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {        
        const text = this.add.text(750, 350, 'GAME OVER!', { fontFamily: 'Ewert', fontSize: '20px', color: '#000' }).setOrigin(0.5);

        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 3000,
            yoyo: true,
            onUpdate: (tween) => {
                const v = tween.getValue();
                const c = 255 * v;

                text.setFontSize(20 + v * 64);
                text.setColor(`rgb(${c}, ${c}, ${c})`);
            }
        });
    }
}

