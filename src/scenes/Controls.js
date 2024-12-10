import { Scene } from "phaser";

export class Controls extends Scene {
    constructor() {
        super('Controls');
    }
    
    create() {
        const { width, height } = this.scale;
        
        this.add.text(width / 2, 20, 'Controles', {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center',
        }).setOrigin(0.5, 0);
        
        const controlsText = `
            W - Mover Arriba
            A - Mover Izquierda
            S - Mover Abajo
            D - Mover Derecha
            SPACE - Disparar
        `;

        this.add.text(width / 2, height / 2, controlsText, {
            font: '24px Arial',
            fill: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);
        
        const startText = this.add.text(width / 2, height - 50, 'Pulse click izquierdo para empezar', {
            font: '20px Arial',
            fill: '#ffffff',
            align: 'center',
        }).setOrigin(0.5).setAlpha(0);

        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: startText,
                alpha: 1,
                duration: 1000, 
                onComplete: () => {                    
                    this.input.once('pointerdown', () => {
                        this.scene.start('Game'); 
                    });
                },
            });
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Game'); 
        });
    }
}