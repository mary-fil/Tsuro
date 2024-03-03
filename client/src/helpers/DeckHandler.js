import CardBack from "./cards/CardBack";

//used to deal cards
//shuffling cards

export default class DeckHandler{
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            let newCard = new CardBack(scene);
            return(newCard.render(x,y,type));
        }
    }
}