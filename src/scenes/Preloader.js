import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 404, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 404, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo-Cyclops.png');

        this.load.image('playerPlane', 'Dengekidan_Meteos.png')

        this.load.image('Undamin', 'Undamin_Meteos.png');
        this.load.image('Demoku', 'Demoku_Meteos.png');
        this.load.image('Lazenjer', 'Lazenjer_Meteos.png');

        this.load.image('bullet', '5.png');

        this.load.atlas('bulletShooted', '8_1.png', 'bulletShooted.json')    
        
        this.game.worker
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
