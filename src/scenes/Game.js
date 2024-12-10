import { Scene } from 'phaser';
import Bullet from '../entities/Bullet';

class EnemyBullet extends Phaser.Physics.Arcade.Image
{
    constructor (scene, bulletType)
    {
        super(scene, 0, 0, bulletType);
    }
}

export class Game extends Scene {
    constructor() {
        super('Game');
        this.player = null;
        this.bullets = null;
        this.arena = null;
        this.borders = null;
        this.cursors = null;
        this.W = null;
        this.A = null;
        this.D = null;
        this.S = null;
        this.fire = null;
        this.lastFired = 0;
        this.undamin = null; //jefe
        this.undaminBullets = null; 
        this.undaminMoving = null;
        this.lazenjer = null; //pinchos rojos
        this.lazenjerBullets = null;
        this.lazenjerMoving = null;
        this.demoku = null; //cabeza-cañon
        this.demokuBullets = null;
        this.demokuMoving = null;
    }

    create() {
        const arenaWidth = 1024 * 0.7;
        const arenaHeight = 768 * 0.7;
        const arenaX = 1024 / 2
        const arenaY = 768 / 2
        
        this.arena = this.add.rectangle(arenaX, arenaY, arenaWidth, arenaHeight);
        this.arena.setStrokeStyle(2, 0xffffff); 
        this.arena.setAlpha(0);
        
        this.tweens.add({
            targets: this.arena,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });
        
        this.borders = this.physics.add.staticGroup();
                    
        this.borders.create(arenaX, arenaY - arenaHeight / 2, 'invisible')
            .setSize(arenaWidth, 1)
            .setVisible(false); 
                    
        this.borders.create(arenaX, arenaY + arenaHeight / 2, 'invisible')
            .setSize(arenaWidth, 1)
            .setVisible(false);
                    
        this.borders.create(arenaX - arenaWidth / 2, arenaY, 'invisible')
            .setSize(1, arenaHeight)
            .setVisible(false);
                    
        this.borders.create(arenaX + arenaWidth / 2, arenaY, 'invisible')
            .setSize(1, arenaHeight)
            .setVisible(false);            

        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.player = this.physics.add.sprite(arenaX, arenaY, 'playerPlane').setScale(0.15, 0.15);        
        this.player.setOrigin(0.5, 0.5);
        this.player.setAlpha(0);
        this.tweens.add({
            targets: this.player,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });

        this.physics.add.collider(this.player, this.borders);
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 30,
            runChildUpdate: true
        });
        this.physics.add.collider(this.bullets, this.borders, (bullet) => {
            bullet.setActive(false);
            bullet.setVisible(false);
        });

        //this.undaminBullets = this.physics.add.existing(new Phaser.GameObjects.Group(this));

        this.undamin = this.physics.add.sprite(arenaX, arenaY/4, 'Undamin').setScale(0.3, 0.3);
        this.undamin.setOrigin(0.5, 0.5);
        this.undamin.setAlpha(0);
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: this.undamin,
                alpha: 1,
                duration: 2000,
                ease: 'Power2'
            });
            this.undaminMoving = this.tweens.add({
                targets: this.undamin.velocity,
                props: {
                    x: { from: 550, to: -550, duration: 3000 },
                    y: { from: 150, to: -150, duration: 1000 }
                },
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        })
        
        this.lazenjer = this.physics.add.sprite(arenaX-70, arenaY/4+60, 'Lazenjer').setScale(0.2, 0.2);
        this.lazenjer.setOrigin(0.5, 0.5);
        this.lazenjer.setAlpha(0);
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: this.lazenjer,
                alpha: 1,
                duration: 2000,
                ease: 'Power2'
            });
        })

        this.demoku = this.physics.add.sprite(arenaX+70, arenaY/4+60, 'Demoku').setScale(0.2, 0.2);
        this.demoku.setOrigin(0.5, 0.5);
        this.demoku.setAlpha(0);
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: this.demoku,
                alpha: 1,
                duration: 2000,
                ease: 'Power2'
            });
        })
    }

    update(time, delta) {        
        const pointer = this.input.activePointer;
        const angle = Phaser.Math.Angle.BetweenPoints(this.player, pointer);
        this.player.rotation = angle;
        const speed = 260;
        this.player.setVelocity(0)
        if (this.A.isDown){
            this.player.setVelocityX(-speed);                
        }
        if (this.D.isDown){
            this.player.setVelocityX(speed);                
        }
        if (this.W.isDown){
            this.player.setVelocityY(-speed);
        }
        if (this.S.isDown){
            this.player.setVelocityY(speed);
        }
        if (this.fire.isDown && time > this.lastFired) {
            const bullet = this.bullets.get();
            if (bullet) {
                bullet.fire(this.player, angle);
                this.lastFired = time + 150;
            }
        }
    }
}