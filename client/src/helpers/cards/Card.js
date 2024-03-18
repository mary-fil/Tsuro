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
                
                // does not work
                console.log(name);
                scene.map.putTileAtWorldXY(name, x, y);
                // No need to return anything as tiles are rendered directly onto the layer
                return null;
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