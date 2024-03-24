export default class Card {
    constructor (scene) {
        this.render = (x, y, type, name) => {
            let sprite;
            if (name === "cardBack" && type === 'playerCard'){
                sprite = this.playerCardSprite;
            } else if (name === "cardBack" && type === 'opponentCard'){
                sprite = this.opponentCardSprite;
            }
            else {
                sprite = "tile" + name; 
            }
            let card = scene.add.image(x, y, sprite).setInteractive().setData({
                "name": name,
                "type": type,
                "sprite": sprite,
            })
            if(type === 'playerCard' && name !== "cardBack"){
                scene.input.setDraggable(card);
                card.setScale(0.7, 0.7);
            } else if (type === 'opponentCard' && name === "cardBack"){
                card.setScale(0.5, 0.5);
            }
            return card;
        }
    }
}