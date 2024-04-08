import Phaser from 'phaser';

export default class Bullet extends Phaser.GameObjects.Image{
    constructor (scene)
    {
        super(scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    }

fire (shooter, target){
    this.setPosition(shooter.x, shooter.y); // Posición inicial
    this.direction = Math.atan2(target.y - shooter.y, target.x - shooter.x);

    // Normalizar velocidades
    this.xSpeed = this.speed * Math.cos(this.direction);
    this.ySpeed = this.speed * Math.sin(this.direction);

    this.rotation = this.direction; // Ángulo de la bala con la dirección
    this.born = 0; // Tiempo desde que se creó la nueva bala

}


    update (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}



