import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {

    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        // this.load.image('tile1', 'tile1.png');
        // this.load.image('tile2', 'tile2.png');
        // this.load.image('tile3', 'tile3.png');
        // this.load.image('tile4', 'tile4.png');
        // this.load.image('tile5', 'tile5.png');
        // this.load.image('tile6', 'tile6.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
