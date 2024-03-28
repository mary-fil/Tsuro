export default class GameHandler{
    constructor(scene) {
        this.gameState = "Initializing";
        this.isMyTurn = false;
        
        this.Deck = [];
        // this.opponentDeck = [];

        this.playerHand = [];
        this.opponentHand = [];

        this.playerMarkerX = 200;
        this.playerMarkerY = 250;
        this.playerMarkerPosition = 0;

        this.opponentMarkerX = 200;
        this.opponentMarkerY = 250;

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
            console.log("isMyTurn: " + this.isMyTurn);
        }

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
            console.log("GameState: " + this.gameState);
        }
    }
}