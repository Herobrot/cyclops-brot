import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game'); // Ensure the scene key matches the one used in the SceneManager
        this.player = null;
        this.arena = null;
        this.cursors = null;
    }

    create() {
        // Ensure that you're adding this scene correctly in your main Phaser config

        // Create the "arena" rectangle (70% of the screen)
        const arenaWidth = 1024 * 0.7;
        const arenaHeight = 768 * 0.7;

        // Add arena with alpha set to 0 initially
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

        // Create the player sprite with physics enabled
        this.player = this.physics.add.sprite(1024 / 2, 768 / 2, 'playerPlane');
        this.player.setOrigin(0.5, 0.5);
        this.player.setScale(0.3); // Adjust scale

        // Add keyboard controls (WASD keys)
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Mouse pointer rotation
        this.input.on('pointermove', this.handlePlayerRotation, this);

        // Prevent player from moving outside the world bounds
        this.player.setCollideWorldBounds(true);
    }

    update() {
        // Handle player movement with WASD keys
        const speed = 200;
        this.player.setVelocity(0); // Reset velocity

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }
    }

    handlePlayerRotation(pointer) {
        // Rotate the player to face the mouse pointer
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
        this.player.rotation = angle;
    }
}
