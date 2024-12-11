import { Scene } from "phaser";

export class Victory extends Scene {
    constructor() {
        super({ key: 'Victory' });
    }

    create() {
    
        this.add.rectangle(
            this.game.config.width/2, 
            this.game.config.height/2, 
            this.game.config.width, 
            this.game.config.height, 
            0x000000, 
            0.5);

    
        this.add.text(this.game.config.width/2, this.game.config.height/3, 'VICTORY!', { 
            fontSize: '48px', 
            color: '#4dff4d' 
        }).setOrigin(0.5);

    
        this.add.text(this.game.config.width/2, this.game.config.height/2, 'Reiniciar', { 
            fontSize: '32px', 
            color: '#ffffff' 
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Game');
        });

    
        this.add.text(this.game.config.width/2, this.game.config.height/1.5, 'Menú Principal', { 
            fontSize: '32px', 
            color: '#ffffff' 
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
