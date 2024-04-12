import CardBack from "./cards/CardBack";
import Card from "./cards/Card";

//used to deal cards
//shuffling cards

export default class DeckHandler{
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {

            let newCard;
            if(name === "cardBack"){
                newCard = new CardBack(scene);
            } else{
                newCard = new Card(scene);
            }
            
            return(newCard.render(x,y,type, name));
        }
    }
}