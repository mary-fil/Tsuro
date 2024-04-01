import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        
        let startText = this.add.text(800, 450, 'START GAME', {
            fontFamily: 'Verdana', 
            fontSize: 50, 
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        startText.setInteractive(); // Enable input on the text

        startText.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
