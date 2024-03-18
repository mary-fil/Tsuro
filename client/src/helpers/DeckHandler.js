import CardBack from "./cards/CardBack";
import Card from "./cards/Card";

//used to deal cards
//shuffling cards

export default class DeckHandler{
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            // name = nazwa karty czyli np 1
            // type = typ carty, np player albo opponent

            // brakuje uzycia name, shuffle dziala losujac names
            // musi przekazywac tile
            let newCard;
            if(name === "cardBack"){
                console.log(name);
                newCard = new CardBack(scene);
            } else{
                console.log(name);
                newCard = new Card(scene);
            }

            //do zmiany bo na razie wystawia same tyły kart
            // powinno byc new Card(scene)
            return(newCard.render(x,y,type, name));
        }
    }
}