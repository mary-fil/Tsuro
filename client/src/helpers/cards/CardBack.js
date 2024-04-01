import Card from "./Card";

export default class CardBack extends Card{
    constructor(scene) {
        super(scene);
        this.name = "cardBack";
        this.playerCardSprite = "bluetile_back";
        this.opponentCardSprite = "bluetile_back";
        //this.opponentCardSprite = "redtile_back";
    }
}