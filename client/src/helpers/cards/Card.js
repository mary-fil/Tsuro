let sequences = [
    [1, 2, 3, 4, 5, 6, 7, 8], //1
    [1, 7, 2, 8, 3, 4, 5, 6],
    [1, 8, 2, 7, 3, 4, 5, 6],
    [1, 6, 2, 8, 3, 4, 5, 7],
    [1, 8, 2, 6, 3, 4, 5, 7], //5
    [1, 6, 2, 7, 3, 4, 5, 8],
    [1, 7, 2, 6, 3, 4, 5, 8],
    [1, 5, 2, 8, 3, 4, 6, 7],
    [1, 5, 2, 7, 3, 4, 6, 8],
    [1, 5, 2, 6, 3, 4, 7, 8], //10
    [1, 8, 2, 5, 3, 4, 6, 7],
    [1, 7, 2, 5, 3, 4, 6, 8],
    [1, 6, 2, 5, 3, 4, 7, 8],
    [1, 7, 2, 8, 3, 5, 4, 6],
    [1, 8, 2, 7, 3, 5, 4, 6], //15
    [1, 6, 2, 8, 3, 5, 4, 7],
    [1, 8, 2, 6, 3, 5, 4, 7],
    [1, 6, 2, 7, 3, 5, 4, 8],
    [1, 7, 2, 6, 3, 5, 4, 8],
    [1, 4, 2, 8, 3, 5, 6, 7], //20
    [1, 4, 2, 7, 3, 5, 6, 8],
    [1, 8, 2, 4, 3, 5, 6, 7],
    [1, 7, 2, 4, 3, 5, 6, 8],
    [1, 8, 2, 7, 3, 6, 4, 5],
    [1, 5, 2, 8, 3, 6, 4, 7], //25
    [1, 8, 2, 5, 3, 6, 4, 7],
    [1, 5, 2, 7, 3, 6, 4, 8],
    [1, 4, 2, 7, 3, 6, 5, 8],
    [1, 6, 2, 8, 3, 7, 4, 5],
    [1, 8, 2, 6, 3, 7, 4, 5], //30
    [1, 5, 2, 8, 3, 7, 4, 6], 
    [1, 5, 2, 6, 3, 7, 4, 8],
    [1, 6, 2, 5, 3, 7, 4, 8],
    [1, 6, 2, 5, 3, 8, 4, 7],
    [1, 8, 2, 3, 4, 5, 6, 7] //35
];

export default class Card {
    constructor (scene) {
        this.render = (x, y, type, name) => {

            let sprite;
            let sequence;
            let pairs;

            if (name === "cardBack" && type === 'playerCard'){
                sprite = this.playerCardSprite;
            } else if (name === "cardBack" && type === 'opponentCard'){
                sprite = this.opponentCardSprite;
            }
            else {
                sprite = "tile" + name; 
                sequence = sequences[name - 1];
                pairs = this.createPairs(sequence);
            }

            let card = scene.add.image(x, y, sprite).setInteractive().setData({
                "name": name,
                "type": type,
                "sprite": sprite,
                "pairs": pairs,
                "angle": 0
            })
            if(type === 'playerCard' && name !== "cardBack"){
                scene.input.setDraggable(card);
                card.setScale(0.7, 0.7);
            } else if (type === 'opponentCard' && name === "cardBack"){
                card.setScale(0.5, 0.5);
            }
            card.setDepth(0);
            return card;
        }

        this.getPairsByName = (name) => {
            if (name !== "cardBack") {
                const sequence = sequences[name - 1];
                return this.createPairs(sequence);
            } else {
                return null; 
            }
        };
    }

    createPairs(sequence) {
        const pairs = [];
        for (let i = 0; i < sequence.length; i += 2) {
            pairs.push([sequence[i], sequence[i + 1]]);
        }
        return pairs;
    }
}