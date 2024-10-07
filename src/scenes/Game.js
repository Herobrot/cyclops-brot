import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.player = null;
        this.arena = null;
        this.cursors = null;
        this.W = null;
        this.A = null;
        this.D = null;
        this.S = null;
    }

    create() {
        // Create the "arena" rectangle (70% of the screen)
        const arenaWidth = 1024 * 0.7;
        const arenaHeight = 768 * 0.7;
        
        this.arena = this.add.rectangle(1024 / 2, 768 / 2, arenaWidth, arenaHeight);
        this.arena.setStrokeStyle(2, 0xffffff); // White border
        this.arena.setAlpha(0); // Start invisible

        // Fade-in animation
        this.tweens.add({
            targets: this.arena,
            alpha: 1,
            duration: 1000, // Fade-in over 1 second
            ease: 'Power2'
        });

        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        // Create the player sprite (e.g., airplane)
        this.player = this.add.sprite(1024 / 2, 768 / 2, 'playerPlane');
        //Necesita fisicas
        this.player.setOrigin(0.5, 0.5);
        
    }

    update() {
        // Continuously rotate the player towards the mouse cursor
        const pointer = this.input.activePointer;
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
        this.player.rotation = angle;

        const speed = 200;
        console.log(this.player);

        if(this.player){
            if (this.W.isDown) {
                //Body de player es nulo
                this.player.setVelocityY(-speed);
            } else if (this.S.isDown) {
                this.player.setVelocityY(speed);
            }
    
            if (this.A.isDown) {
                this.player.setVelocityX(-speed);
            } else if (this.D.isDown) {
                this.player.setVelocityX(speed);
            }
        }
    }

    handlePlayerMovement(pointer) {
        // Update player's position to follow the mouse
        this.player.x = pointer.x;
        this.player.y = pointer.y;

        // Prevent player from moving outside the arena
        const arenaBounds = this.arena.getBounds();
        if (this.player.x < arenaBounds.left) this.player.x = arenaBounds.left;
        if (this.player.x > arenaBounds.right) this.player.x = arenaBounds.right;
        if (this.player.y < arenaBounds.top) this.player.y = arenaBounds.top;
        if (this.player.y > arenaBounds.bottom) this.player.y = arenaBounds.bottom;
    }
}