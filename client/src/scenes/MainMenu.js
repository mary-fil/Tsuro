import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        let backgroundRect = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xeecc66).setOrigin(0);

        let welcomeText = this.add.text(800, 250, 'TSURO', {
            fontFamily: 'Verdana', 
            fontSize: 100, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        let startText = this.add.text(800, 500, 'START GAME', {
            fontFamily: 'Verdana', 
            fontSize: 50, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        startText.setInteractive(); // Enable input on the text

        startText.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
