import CardBack from "./cards/CardBack";

//used to deal cards
//shuffling cards

export default class DeckHandler{
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            // brakuje uzycia name, shuffle dziala losujac names
            // musi przekazywac tile
            let newCard = new CardBack(scene);  //do zmiany bo na razie wystawia same tyły kart
            // powinno byc new Card(scene)
            return(newCard.render(x,y,type));
        }
    }
}