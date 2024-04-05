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

        this.load.image('bluetile_back', 'bluetile_back.png');
        this.load.image('redtile_back', 'redtile_back.png');
        this.load.image('tileset', 'tiles600v1.png');
        this.load.image('board', 'boardblue.png');

        for (let i = 1; i <= 35; i++) {
            this.load.image('tile' + i, 'tile (' + i + ').png');
        }

        this.load.image('1_2', 'path1_2.png');
        this.load.image('1_3', 'path1_3.png');
        this.load.image('1_4', 'path1_4.png');
        this.load.image('1_5', 'path1_5.png');
        this.load.image('1_6', 'path1_6.png');
        this.load.image('1_7', 'path1_7.png');
        this.load.image('1_8', 'path1_8.png');
        this.load.image('2_4', 'path2_4.png');
        this.load.image('2_6', 'path2_6.png');
        this.load.image('2_7', 'path2_7.png');
        this.load.image('3_2', 'path3_2.png');
        this.load.image('3_4', 'path3_4.png');
        this.load.image('3_5', 'path3_5.png');
        this.load.image('3_6', 'path3_6.png');
        this.load.image('3_7', 'path3_7.png');
        this.load.image('3_8', 'path3_8.png');
        this.load.image('4_6', 'path4_6.png');
        this.load.image('4_7', 'path4_7.png');
        this.load.image('5_2', 'path5_2.png');
        this.load.image('5_4', 'path5_4.png');
        this.load.image('5_6', 'path5_6.png');
        this.load.image('5_7', 'path5_7.png');
        this.load.image('5_8', 'path5_8.png');
        this.load.image('6_7', 'path6_7.png');
        this.load.image('8_2', 'path8_2.png');
        this.load.image('8_4', 'path8_4.png');
        this.load.image('8_6', 'path8_6.png');
        this.load.image('8_7', 'path8_7.png');
  
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.


        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
