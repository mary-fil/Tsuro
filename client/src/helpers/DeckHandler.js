import CardBack from "./cards/CardBack";

//used to deal cards
//shuffling cards

export default class DeckHandler{
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            let newCard = new CardBack(scene);  //do zmiany bo na razie wystawia same tyły kart
            return(newCard.render(x,y,type));
        }
    }
}