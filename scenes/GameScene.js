import Phaser from 'phaser';
import Bullet from '../Bullet';
import { game } from '../main';


export default class GameScene extends Phaser.Scene {

    time = 0;
    enemyBullets;
    playerBullets;
    moveKeys;
    reticle;
    healthpoints;
    player;
    enemy;
    hp1;
    hp2;
    hp3;
  
    constructor() {
      super("GameScene")
      this.playerHealth = 120; // Life
    }
  
    preload() {
      // Load in images and sprites
      this.load.spritesheet('player_handgun','/public/assets/principal_character/personaje2.png', { frameWidth: 313, frameHeight: 207 });  
      this.load.spritesheet('enemy_pistol', '/public/assets/bots/jujui.png', { frameWidth: 344, frameHeight: 470 })
      // Load bullet img
      this.load.image('bullet', '/public/assets/complements/fired.jpg');
      //Load the scope
      this.load.image('target', '/public/assets/crosshair/ui_pixels_v2-09_copy-512.png');
      //Load BG
      this.load.image('gamebackground', '/public/assets/map&bg/solido.jpg');
      //Boton de pantalla principal
      this.load.image('buttonBG', '/public/assets/botones/play_btn.png');
  
    }
  
  
    create() {
      // Create world bounds
      this.physics.world.setBounds(0, 0, 1600, 1200);
  
      // Add 2 groups for Bullet objects
      this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
      this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  
      // Add background, player, and reticle sprites
      const gamebackground = this.add.image(800, 600, 'gamebackground');
      this.player = this.physics.add.sprite(800, 600, 'player_handgun');
      this.enemy = this.physics.add.sprite(300, 600, 'enemy_pistol');
      this.reticle = this.physics.add.sprite(800, 700, 'target');
      this.hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0.5, 0.5);
      this.hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0.5, 0.5);
      this.hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0.5, 0.5);
  
      // Set image/sprite properties
      gamebackground.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
      this.player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
      this.enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
      this.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
      this.hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
      this.hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
      this.hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
  
      // Set sprite variables
      this.player.health = 3;
      this.enemy.health = 3;
      this.enemy.lastFired = 0;
  
      // Set camera properties
      this.cameras.main.zoom = 0.5;
      this.cameras.main.startFollow(this.player);
  
      // Set camera zoom
      this.cameras.main.zoom = 0.5;
  
      // Creates object for input with WASD keys
      this.cursors = this.input.keyboard.createCursorKeys();
  
      // Enables movement of player with WASD keys
      this.input.keyboard.on('keydown-W', () => {
        this.player.setAccelerationY(-800);
      });
      this.input.keyboard.on('keydown-S', () => {
        this.player.setAccelerationY(800);
      });
      this.input.keyboard.on('keydown-A', () => {
        this.player.setAccelerationX(-800);
      });
      this.input.keyboard.on('keydown-D', () => {
        this.player.setAccelerationX(800);
      });
  
      // Stops player acceleration on release of WASD keys
      this.input.keyboard.on('keyup-W', () => {
        if (!this.cursors.down.isDown) { this.player.setAccelerationY(0); }
      });
      this.input.keyboard.on('keyup-S', () => {
        if (!this.cursors.up.isDown) { this.player.setAccelerationY(0); }
      });
      this.input.keyboard.on('keyup-A', () => {
        if (!this.cursors.right.isDown) { this.player.setAccelerationX(0); }
      });
      this.input.keyboard.on('keyup-D', () => {
        if (!this.cursors.left.isDown) { this.player.setAccelerationX(0); }
      });
  
      // Fires bullet from player on left click of mouse
          this.input.on('pointerdown', (pointer, time, lastFired) =>
          {
              if (this.player.active === false) { return; }
  
              // Get bullet from bullets group
              const bullet = this.playerBullets.get().setActive(true).setVisible(true);
  
              if (bullet)
              {
                  bullet.fire(this.player, this.reticle);
                  this.physics.add.collider(this.enemy, bullet, (enemyHit, bulletHit) => this.enemyHitCallback(enemyHit, bulletHit));
              }
          });
  
          // Pointer lock will only work after mousedown
          game.canvas.addEventListener('mousedown', () => {
              game.input.mouse.requestPointerLock();
          });
  
          // Exit pointer lock when Q or escape (by default) is pressed.
          this.input.keyboard.on('keydown_Q', event => {
              if (game.input.mouse.locked) { game.input.mouse.releasePointerLock(); }
          }, 0);
  
          // Move reticle upon locked pointer move
          this.input.on('pointermove', pointer =>
          {
              if (this.input.mouse.locked)
              {
                  this.reticle.x += pointer.movementX;
                  this.reticle.y += pointer.movementY;
              }
          });
  
    }
  
    update(time, delta) {
      // Rotates player to face towards reticle
      this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);
  
      // Rotates enemy to face towards player
      this.enemy.rotation = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
  
      // Make reticle move with player
      this.reticle.body.velocity.x = this.player.body.velocity.x;
      this.reticle.body.velocity.y = this.player.body.velocity.y;
  
      // Constrain velocity of player
      this.constrainVelocity(this.player, 500);
  
      // Constrain position of constrainReticle
      this.constrainReticle(this.reticle);
  
      // Make enemy fire
      this.enemyFire(time);
  }
  
  enemyHitCallback (enemyHit, bulletHit)
  {
      // Reduce health of enemy
      if (bulletHit.active === true && enemyHit.active === true)
      {
          enemyHit.health = enemyHit.health - 1;
          console.log('Enemy hp: ', enemyHit.health);
  
          // Kill enemy if health <= 0
          if (enemyHit.health <= 0)
          {
              enemyHit.setActive(false).setVisible(false);
          }
  
          // Destroy bullet
          bulletHit.setActive(false).setVisible(false);
      }
  }
  
  playerHitCallback(playerHit, bulletHit) {
    // Reducir la vida del jugador solo si está por encima de cero
    if (bulletHit.active === true && playerHit.active === true && this.playerHealth > 0) {
        // Reducir la vida del jugador en 20
        this.playerHealth -= 20;

        // Asegurarse de que la vida del jugador no sea negativa
        if (this.playerHealth < 0) {
            this.playerHealth = 0;
        }

        // Mostrar la vida restante del jugador
        console.log('¡El jugador ha sido golpeado! Vida restante:', this.playerHealth);

        // Actualizar los sprites de corazón según la vida restante
        // Implementa esto si deseas mostrar los corazones en el juego

        // Verificar si la vida del jugador es cero para la transición a la escena de Game Over
        if (this.playerHealth === 0) {
            this.scene.start('GameOverScene');
        }

        // Destruir la bala
        bulletHit.setActive(false).setVisible(false);
    }
}



  
  enemyFire (time)
  {
      if (this.enemy.active === false)
      {
          return;
      }
  
      if ((time - this.enemy.lastFired) > 1000)
      {
          this.enemy.lastFired = time;
  
          // Get bullet from bullets group
          const bullet = this.enemyBullets.get().setActive(true).setVisible(true);
  
          if (bullet)
          {
              bullet.fire(this.enemy, this.player);
  
              // Add collider between bullet and player
              this.physics.add.collider(this.player, bullet, (playerHit, bulletHit) => this.playerHitCallback(playerHit, bulletHit));
          }
      }
  }
  
  constrainVelocity (sprite, maxVelocity)
  {
      if (!sprite || !sprite.body)
      { return; }
  
      let angle, currVelocitySqr, vx, vy;
      vx = sprite.body.velocity.x;
      vy = sprite.body.velocity.y;
      currVelocitySqr = vx * vx + vy * vy;
  
      if (currVelocitySqr > maxVelocity * maxVelocity)
      {
          angle = Math.atan2(vy, vx);
          vx = Math.cos(angle) * maxVelocity;
          vy = Math.sin(angle) * maxVelocity;
          sprite.body.velocity.x = vx;
          sprite.body.velocity.y = vy;
      }
  }
  
  constrainReticle (reticle)
  {
      const distX = reticle.x - this.player.x; // X distance between player & reticle
      const distY = reticle.y - this.player.y; // Y distance between player & reticle
  
      // Ensures reticle cannot be moved offscreen (player follow)
      if (distX > 800)
      { reticle.x = this.player.x + 800; }
      else if (distX < -800)
      { reticle.x = this.player.x - 800; }
  
      if (distY > 600)
      { reticle.y = this.player.y + 600; }
      else if (distY < -600)
      { reticle.y = this.player.y - 600; }
  }
  }


