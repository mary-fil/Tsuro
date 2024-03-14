export default class Card {
    constructor (scene) {
        this.render = (x, y, type, tile) => {
            let sprite;
            if (this.name === "cardBack" && type === 'playerCard'){
                sprite = this.playerCardSprite;
            } else if (this.name === "cardBack" && type === 'opponentCard'){
                sprite = this.opponentCardSprite;
            }
            else {
                // if its not a back of a card sprite should be a tile
                sprite = tile;
            }
            let card = scene.add.image(x, y, sprite).setInteractive().setData({
                "name": this.name,
                "type": type,
                "sprite": sprite,
                "preview": true
            })
            if(type === 'playerCard'){
                scene.input.setDraggable(card);
            } else {
                card.setScale(0.5, 0.5);
            }
            return card;
        }
    }
}