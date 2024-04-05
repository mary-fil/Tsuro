import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init(data) {
        this.outcome = data.text; 
    }

    create ()
    {
        let gameOverText = this.add.text(800, 350, 'GAME OVER', {
            fontFamily: 'Verdana', 
            fontSize: 50, 
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        let outcomeText = this.add.text(800, 450, this.outcome, {
            fontFamily: 'Verdana', 
            fontSize: 50, 
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        // TO DO - fix what happens after going to the main menu
        // reset the data of the game from server

        // let returnText = this.add.text(800, 650, 'Return to Main Menu', {
        //     fontFamily: 'Verdana', 
        //     fontSize: 50, 
        //     color: '#000000',
        //     align: 'center'
        // }).setOrigin(0.5);
        // returnText.setInteractive();

        // returnText.on('pointerdown', () => {

        //     this.scene.start('MainMenu');

        // });
    }
}
