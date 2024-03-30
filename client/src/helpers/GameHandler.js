export default class GameHandler{
    constructor(scene) {
        this.gameState = "Initializing";
        this.isMyTurn = false;
        
        this.Deck = [];
        this.Board = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
            11: [],
            12: [],
            13: [],
            14: [],
            15: [],
            16: [],
            17: [],
            18: [],
            19: [],
            20: [],
            21: [],
            22: [],
            23: [],
            24: [],
            25: [],
            26: [],
            27: [],
            28: [],
            29: [],
            30: [],
            31: [],
            32: [],
            33: [],
            34: [],
            35: []
          }          

        this.playerHand = [];
        this.opponentHand = [];

        this.playerMarkerX = 200;
        this.playerMarkerY = 250;
        this.playerMarkerPosition = 0;

        this.opponentMarkerX = 200;
        this.opponentMarkerY = 250;
        this.opponentMarkerPosition = 0;

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