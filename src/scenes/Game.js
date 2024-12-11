import { Scene } from 'phaser';
import Bullet from '../entities/Bullet';
import BulletEnemy from '../entities/EnemyBullet';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.player = null;
        this.bullets = null;
        this.undaminBullets = null; 
        this.arena = null;
        this.borders = null;
        this.cursors = null;
        this.W = null;
        this.A = null;
        this.D = null;
        this.S = null;
        this.fire = null;
        this.lastFired = 0;
        this.lastEnemyShotTime = 0; 
        this.enemyStartShooting = 0;

        
        this.undamin = null;

        
        this.enemyLogicWorker = null;
        this.bulletWorker = null;
        this.playerMovementWorker = null;
        this.lifeWorker = null;
        this.gamePaused = false;

        
        this.undaminState = {};
    }

    create() {
        this.enemyStartShooting = 1500;
        const arenaWidth = 1024 * 0.7;
        const arenaHeight = 768 * 0.7;
        const arenaX = 1024 / 2;
        const arenaY = 768 / 2;
    
        
        this.arena = this.add.rectangle(arenaX, arenaY, arenaWidth, arenaHeight);
        this.arena.setStrokeStyle(2, 0xffffff);
        this.arena.setAlpha(0);
    
        this.tweens.add({
            targets: this.arena,
            alpha: 1,
            duration: 2000, 
            ease: 'Power2'
        });
    
        
        this.player = this.physics.add.sprite(arenaX, arenaY, 'playerPlane').setScale(0.15, 0.15);
        this.player.setOrigin(0.5, 0.5).setAlpha(0);
    
        this.tweens.add({
            targets: this.player,
            alpha: 1,
            duration: 2000,
            ease: 'Power2'
        });
    
        this.undamin = this.physics.add.sprite(arenaX, arenaY / 4, 'Undamin').setScale(0.3, 0.3);
        this.undamin.setOrigin(0.5, 0.5).setAlpha(0);
        this.undamin.setRotation(Phaser.Math.DegToRad(90));
    
        this.tweens.add({
            targets: this.undamin,
            alpha: 1,
            duration: 2000,
            ease: 'Power2'
        });
        this.setupGameLogic(arenaX, arenaY, arenaWidth, arenaHeight);
        this.game.pause();
        this.game.resume();
    }
    
    setupGameLogic(arenaX, arenaY, arenaWidth, arenaHeight) {
        
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
    
        this.physics.add.collider(this.player, this.borders);
        
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 30,
            runChildUpdate: true
        });
            
        this.undaminBullets = this.physics.add.group({
            classType: BulletEnemy,
            maxSize: 20,
            runChildUpdate: true
        });
    
        
        this.physics.add.overlap(this.bullets, this.undamin, (enemy, bullet) => {
            bullet.setActive(false);
            bullet.setVisible(false);
            this.lifeWorker.postMessage({
                action: 'hitEnemy',
            });
        });
    
        this.physics.add.overlap(this.undaminBullets, this.player, (player, bullet) => {
            bullet.setActive(false);
            bullet.setVisible(false);
            this.lifeWorker.postMessage({
                action: 'hitPlayer',
            });
        });    
        
        this.undaminState = {
            x: arenaX,
            y: arenaY / 4,
            speed: { x: 4, y: 1 },
            bounds: {
                minX: arenaX - arenaWidth / 2,
                maxX: arenaX + arenaWidth / 2,
                minY: arenaY - arenaHeight / 2,
                maxY: arenaY + arenaHeight / 2
            }
        };
    
        this.initWorkers();
    }
    
    initWorkers() {
        this.enemyLogicWorker = new Worker(new URL('../workers/enemyLogicWorker.js', import.meta.url));
        this.bulletWorker = new Worker(new URL('../workers/enemyBulltetWorker.js', import.meta.url));
        this.playerMovementWorker = new Worker(new URL('../workers/playerMovementWorker.js', import.meta.url));
        this.lifeWorker = new Worker(new URL('../workers/lifeWorker.js', import.meta.url));
    
        this.playerMovementWorker.onmessage = (e) => {
            const { action, newPosition } = e.data;
            if (action === 'updatePlayerPosition') {
                this.player.setPosition(newPosition.x, newPosition.y);
            }
        };
    
        this.enemyLogicWorker.onmessage = (e) => {
            const { action, newPosition, newSpeed } = e.data;
            if (action === 'updateEnemyPosition') {
                this.undaminState.x = newPosition.x;
                this.undaminState.y = newPosition.y;
                this.undaminState.speed = newSpeed;
                this.undamin.setPosition(newPosition.x, newPosition.y);
            }
        };
    
        this.lifeWorker.onmessage = (e) => {
            const { action, newHP } = e.data;
            switch (action) {
                case 'updatePlayerHP':
                    console.log(`Vida del jugador: ${newHP}`);
                    if (newHP <= 0) {
                        console.log('El jugador ha muerto.');
                        this.gameOver();
                    }
                    break;
                case 'updateEnemyHP':
                    console.log(`Vida del enemigo: ${newHP}`);
                    if (newHP <= 0) {
                        console.log('El enemigo ha muerto.');
                        this.undaminBullets.setVisible(false);
                        this.victory();
                    }
                    break;
                case 'playerDied':
                    console.log('El jugador ha sido eliminado.');
                    this.gameOver();
                    break;
                case 'enemyDied':
                    console.log('El enemigo ha sido eliminado.');
                    this.victory();
                    break;
                default:
                    console.error('Acción no reconocida:', action);
                    break;
            }
        };
    }
    

    gameOver(){
        this.scene.start('GameOver');
    }
    victory(){
        this.scene.start('Victory');
    }
    respawnEnemy() {
        this.undamin.setPosition(
            Phaser.Math.Between(
                this.undaminState.bounds.minX, 
                this.undaminState.bounds.maxX
            ),
            Phaser.Math.Between(
                this.undaminState.bounds.minY, 
                this.undaminState.bounds.maxY
            )
        );
    
        this.lifeWorker.postMessage({ action: 'resetEnemy' });
        console.log('Nuevo enemigo generado.');
    }
    

    update(time, delta) {
        if (this.gamePaused) return;
        if (this.enemyStartShooting) {
            this.enemyStartShooting -= delta;
        }
        const enemyShootInterval = Phaser.Math.Between(100, 1500); 
        const speed = 260;
        try {
            if (this.playerHP <= 0) {
                this.scene.restart();
                this.lifeWorker.postMessage({ action: 'resetPlayer' });
            }
            if (this.player) {
                this.playerMovementWorker.postMessage({
                    action: 'calculatePlayerMovement',
                    data: {
                        x: this.player.x,
                        y: this.player.y,
                        speed: speed * (delta / 1000),
                        inputs: {
                            left: this.A.isDown,
                            right: this.D.isDown,
                            up: this.W.isDown,
                            down: this.S.isDown,
                        },
                        bounds: {
                            minX: this.arena.x - this.arena.width / 2,
                            maxX: this.arena.x + this.arena.width / 2,
                            minY: this.arena.y - this.arena.height / 2,
                            maxY: this.arena.y + this.arena.height / 2
                        }
                    },
                });

                let angle = 0;
                const pointer = this.input.activePointer;
                if (this.player.x !== undefined && this.player.y !== undefined && pointer.x !== undefined && pointer.y !== undefined) {
                    angle = Phaser.Math.Angle.BetweenPoints(this.player, pointer);
                    this.player.rotation = angle;
                } else {
                    console.error('Posición o puntero no definido');
                }

                if (this.fire.isDown && time > this.lastFired) {
                    const bullet = this.bullets.get();
                    if (bullet) {
                        bullet.fire(this.player, angle);
                        this.lastFired = time + 150;
                    }
                }
            } else {
                console.error('El jugador no está definido');
            }
        } catch (error) {
            console.error('Error en la actualización del jugador:', error);
        }

        this.enemyLogicWorker.postMessage({
            action: 'calculateEnemyMovement',
            data: {
                x: this.undaminState.x,
                y: this.undaminState.y,
                speed: this.undaminState.speed,
                bounds: this.undaminState.bounds
            }
        });

        
        if (time > this.lastEnemyShotTime + enemyShootInterval && this.enemyStartShooting <= 0) {
            const enemyBullet = this.undaminBullets.get();
            if (enemyBullet && this.player) {
                const enemyAngle = Phaser.Math.Angle.BetweenPoints(this.undamin, this.player);
                enemyBullet.fire(this.undamin, enemyAngle);
                this.undamin.rotation = enemyAngle;
                this.lastEnemyShotTime = time;
            }
        }
    }
}