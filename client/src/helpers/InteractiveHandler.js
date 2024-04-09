
let playerColor = 0xaa2200;
let opponentPath = 0x005492;

export default class InteractiveHandler{
    constructor(scene, placesGroup) {

        this.placesGroup = this.placesGroup;

        this.offsets = {
            1: { x: -50, y: 15 },
            2: { x: -50, y: -15 },
            3: { x: -15, y: -50 },
            4: { x: 15, y: -50 },
            5: { x: 50, y: -15 },
            6: { x: 50, y: 15 },
            7: { x: 15, y: 50 },
            8: { x: -15, y: 50 }
        }; 

        // take card
        scene.takeCardButton.on('pointerdown', () => {
            if(scene.GameHandler.isMyTurn){
                scene.takeCardButton.disableInteractive();
                scene.rotateCardsButton.setInteractive();

                scene.socket.emit('takeCard', scene.socket.id);
            }
        })

        scene.takeCardButton.on('pointerover', () => {
            // highlight
            if (!scene.highlightEffect) {
                scene.highlightEffect = scene.add.graphics(); // Create the highlight effect
            }
            scene.highlightEffect.clear(); // Clear previous drawings
            scene.highlightEffect.lineStyle(4, 0x668899); // Set the line style for the highlight
            scene.highlightEffect.strokeRect(1400 - 25 - 150/2, 400 - 50/2, 150, 50);
        })

        scene.takeCardButton.on('pointerout', () => {
            // no highlight
            if (scene.highlightEffect) {
                scene.highlightEffect.clear(); // Clear the highlight effect
            }
        })

        // deal cards
        scene.dealCardsButton.on('pointerdown', () => {
            if(scene.GameHandler.isMyTurn){
                scene.socket.emit('dealCards', scene.socket.id);

                // disable deal cards button
                scene.dealCardsButton.disableInteractive();
                scene.dealCardsButton.setVisible(false);
                scene.dealCards.setVisible(false);

                // enable take card button
                scene.takeCardButton.setVisible(true);
                scene.takeCard.setVisible(true);

                // enable rotate cards button
                scene.rotateCardsButton.setInteractive();
            }
        })

        scene.dealCardsButton.on('pointerover', () => {
            // highlight
            if (!scene.highlightEffect) {
                scene.highlightEffect = scene.add.graphics(); // Create the highlight effect
            }
            scene.highlightEffect.clear(); // Clear previous drawings
            scene.highlightEffect.lineStyle(4, 0x668899); // Set the line style for the highlight
            scene.highlightEffect.strokeRect(1400 - 25 - 150/2, 400 - 50/2, 150, 50);
        })

        scene.dealCardsButton.on('pointerout', () => {
            // no highlight
            if (scene.highlightEffect) {
                scene.highlightEffect.clear(); // Clear the highlight effect
            }
        })

        // rotate cards
        scene.rotateCardsButton.on('pointerdown', () =>{
            // it should be interactive only before placing a card 
            // after placing a card disable button
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready"){
                for(let i = 0; i < 3; i++){
                    let card = scene.GameHandler.playerHandObjects[i];

                    let initialPairs = card.data.values.pairs;
                    let rotatedPairs = this.rotatePairsRight(initialPairs);
                    card.data.values.pairs = rotatedPairs;
                    console.log("Rotated pairs:", rotatedPairs);

                    card.angle += 90;
                    card.data.values.angle = (card.data.values.angle + 90) % 360;
                }
            }
        })

        scene.rotateCardsButton.on('pointerover', () => {
            // highlight
            if (!scene.highlightEffect) {
                scene.highlightEffect = scene.add.graphics(); // Create the highlight effect
            }
            scene.highlightEffect.clear(); // Clear previous drawings
            scene.highlightEffect.lineStyle(4, 0x668899); // Set the line style for the highlight
            scene.highlightEffect.strokeRect(1100 - 100/2, 800 -15 - 50/2, 100, 50);
        })

        scene.rotateCardsButton.on('pointerout', () => {
            // no highlight
            if (scene.highlightEffect) {
                scene.highlightEffect.clear(); // Clear the highlight effect
            }
        })

        //markers
        scene.placeMarkersButton.on('pointerdown', () => {
            
            if (scene.GameHandler.isMyTurn) {
                scene.markerPlayer = scene.add.circle(250 - 25, 300, 10, playerColor);
                scene.markerPlayer.setStrokeStyle(2, 0x000000);

                scene.markerPlayer.type = 'marker';
                //scene.markerPlayer.isPlaced = false;
                scene.markerPlayer.setInteractive({ draggable: true });
                scene.placeMarkersButton.disableInteractive();
            }
        })

        scene.placeMarkersButton.on('pointerover', () => {
            // highlight
            if (!scene.highlightEffect) {
                scene.highlightEffect = scene.add.graphics(); // Create the highlight effect
            }
            scene.highlightEffect.clear(); 
            scene.highlightEffect.lineStyle(4, 0xffffff); 
            scene.highlightEffect.strokeRect(250 - 25 - 100/2, 250 - 50/2, 100, 50);
        })

        scene.placeMarkersButton.on('pointerout', () => {
            // no highlight
            if (scene.highlightEffect) {
                scene.highlightEffect.clear(); 
            }
        })

        scene.input.on('pointerover', (event, gameObjects) => {
            let pointer = scene.input.activePointer;
            const handAreaBounds = { x: 600 - 25, y: 725, width: 450, height: 150 };

            if (gameObjects[0].type === "Image" && gameObjects[0].data.list.name !== "cardBack" &&
                pointer.x >= handAreaBounds.x && pointer.x <= handAreaBounds.x + handAreaBounds.width &&
                pointer.y >= handAreaBounds.y && pointer.y <= handAreaBounds.y + handAreaBounds.height) {
                const image = gameObjects[0];
                if (!scene.highlightEffect) {
                    scene.highlightEffect = scene.add.graphics(); // Create the highlight effect
                }
                scene.highlightEffect.clear(); // Clear previous drawings
                scene.highlightEffect.lineStyle(4, 0xffffff); // Set the line style for the highlight
                scene.highlightEffect.strokeRect(image.x - image.displayWidth / 2, image.y - image.displayHeight / 2, image.displayWidth, image.displayHeight);
            }
        })

        scene.input.on('pointerout', (event, gameObjects) => {
            if(gameObjects[0].type === "Image" && gameObjects[0].data.list.name !== "cardBack"){
                if (scene.highlightEffect) {
                    scene.highlightEffect.clear(); // Clear the highlight effect
                }
            }
        })

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        scene.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setDepth(1);
            if(gameObject.name === "cardBack") {
                gameObject.setTint(0xff69b4);
                scene.children.bringToTop(gameObject);
            } else {
                if (scene.highlightEffect) {
                    scene.highlightEffect.clear(); // Clear the highlight effect
                }
            }
        })

        scene.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.setDepth(0);
            if(gameObject.name === "cardBack") {
                gameObject.setTint();
            }
            if(!dropped){
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            // marker
            if (scene.GameHandler.isMyTurn && gameObject.type === 'marker') {
                let droppedInValidPlace = false;
                placesGroup.children.each(space => {
                    let bounds = space.getBounds();
                    if (bounds.contains(pointer.x, pointer.y)) {
                        let x = space.x;
                        let y = space.y;

                        if (!scene.markerOpponent || (scene.markerOpponent.x !== x || scene.markerOpponent.y !== y)) {
                            droppedInValidPlace = true;
                            gameObject.x = space.x;
                            gameObject.y = space.y;
                            gameObject.disableInteractive();
                        
                            // set starting position of the marker
                            scene.GameHandler.playerMarkerPosition = space.data.values.position;
                        
                            scene.socket.emit('markerMoved', gameObject, scene.socket.id);
                            scene.placeMarkersButton.setVisible(false);
                            scene.placeMarkersButton.disableInteractive();
                        
                            scene.placeMarkerArea.setVisible(false);
                            scene.placeMarkers.setVisible(false);

                        }
                        
                    }
                });
                // If it wasn't dropped in a valid space, move it back to the start
                if (!droppedInValidPlace) {
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
                }
        
            // card
            } else if(scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready") {

                // Handling card drop
                let cellWidth = 100; // Width of each cell in the grid
                let cellHeight = 100; // Height of each cell in the grid
                let offsetX = 550 - cellWidth * 3; // X offset to center the grid
                let offsetY = 100 - cellHeight * 3; // Y offset to center the grid
                let gridX = Math.floor((pointer.x - offsetX + cellWidth / 2) / cellWidth); // Calculate grid X index
                let gridY = Math.floor((pointer.y - offsetY + cellHeight / 2) / cellHeight); // Calculate grid Y index

                // Calculate the position of the dropped card within the grid cell
                let x = offsetX + gridX * cellWidth; 
                let y = offsetY + gridY * cellHeight; 

                // Get the index of the dropped cell in the dropZoneGroup
                let index = scene.dropZone.getChildren().indexOf(dropZone);
                //console.log('index: ', index);

                // Set the cardId of the corresponding cell in the grid
                let cell = scene.dropZone.getChildren()[index];

                // check if marker is on the boarder of this grid
                let isMarkerOnBorder = this.isMarkerOnGridBorder(scene.markerPlayer.x, scene.markerPlayer.y, cell.data.values.gridX, cell.data.values.gridY, cellWidth, cellHeight);
                //console.log('isMarkerOnBorder: ', isMarkerOnBorder);

                if(cell.input.enabled && isMarkerOnBorder){
                    // Move the card to the center of the nearest grid cell
                    gameObject.x = x;
                    gameObject.y = y;

                    scene.input.setDraggable(gameObject, false);
                    gameObject.setScale(0.65, 0.65);

                    cell.data.values.cardId = gameObject.data.values.name;
                    cell.disableInteractive();

                    // update game handler
                    //scene.GameHandler.Board[index].push(gameObject.data.values.pairs);
                    scene.GameHandler.Board[index] = gameObject.data.values.pairs;

                    //console.log('gamehandler: ', scene.GameHandler.Board);

                    // move marker
                    // check path that marker can take
                    // offset table
                    // pairs table - find the second value of the pair and move marker to new location knowing the offset from the center of the grid x, y
                    let newPosition = this.getOtherNumber(gameObject.data.values.pairs, scene.GameHandler.playerMarkerPosition);
                    console.log('starting position: ', scene.GameHandler.playerMarkerPosition);
                    console.log('ending position: ', newPosition);

                    // show path
                    let pathStart = scene.GameHandler.playerMarkerPosition;
                    let pathEnd = newPosition;
                    let isPlayer = true;
                    scene.socket.emit('pathPlaced', isPlayer, x, y, pathStart, pathEnd, scene.socket.id,);
                    
                    let offset = this.offsets[newPosition];

                    // move marker
                    scene.markerPlayer.x = x + offset.x;
                    scene.markerPlayer.y = y + offset.y;
                
                    // update position of marker 
                    scene.GameHandler.playerMarkerPosition = this.swapNumbers(newPosition);
                    
                    // if there is another path ahead - move marker again until there is no path left
                    // find another path that is tangent to the marker 
                    // Call the function and store the result
                    let nextIndex = this.getCellsBorderingMarker(index, scene.dropZone, scene.markerPlayer.x, scene.markerPlayer.y, cellWidth, cellHeight);
                    scene.GameHandler.playerNextIndex = nextIndex;
                    let nextIndexPlayer = index;
                    console.log('Bordering cell:', nextIndex);

                    // if nextIndex === null, this means that the marker is at the border of the board = END OF GAME
                    if(nextIndex === null){
                        console.log('gameOver nr 1');
                        //scene.socket.emit('gameOver', false, isPlayer, scene.socket.id,);
                    }

                    // i = 0 player, i = 1 opponent
                    let position = scene.GameHandler.playerMarkerPosition;
                    console.log('position after the first move', position);
                    
                    let opponentMoved = false;
                    let gameOver = false;
                    for(let i = 0; i < 2; i++){
                        console.log('i: ', i);
                        
                        while(nextIndex !== null){
                            //console.log('while');
                            if(scene.GameHandler.Board[nextIndex].length === 0){
                                // cell is empty, there is no card yet
                                //console.log('break');
                                break;
                            } else {
                                let pairs = scene.GameHandler.Board[nextIndex];
                                console.log('pairs: ', pairs);
                                //let pairs = pairsArray[0];
    
                                let newPosition = this.getOtherNumber(pairs, position);
                                console.log('marker position: ', position);
    
                                console.log('new position end of path: ', newPosition);
        
                                let offset = this.offsets[newPosition];
                                console.log('offset: ', offset);
        
                                //the center of the nearest grid cell
                                let cell = scene.dropZone.getChildren()[nextIndex];
                                let x = cell.data.values.gridX; // top left corner + halfwidth of cell (100)
                                let y = cell.data.values.gridY;
                                //console.log('x: ', x);
                                //console.log('y: ', y);
        
                                // move marker 
                                if(i === 0){
                                    scene.markerPlayer.x = x + offset.x;
                                    scene.markerPlayer.y = y + offset.y;

                                    // show path
                                    let isPlayer = true;
                                    scene.socket.emit('pathPlaced', isPlayer, x, y, position, newPosition, scene.socket.id);
                                
                                    // update position of marker 
                                    scene.GameHandler.playerMarkerPosition = this.swapNumbers(newPosition);
                                    position = scene.GameHandler.playerMarkerPosition;
                                    console.log('new position after swapping: ', position);
        
                                    // update next index
                                    nextIndex = this.getCellsBorderingMarker(nextIndex, scene.dropZone, scene.markerPlayer.x, scene.markerPlayer.y, cellWidth, cellHeight);
                                    if(nextIndex !== null) {
                                        scene.GameHandler.playerNextIndex = nextIndex;
                                        console.log('Bordering cell:', nextIndex);
                                    } else{
                                        // if nextIndex === null, this means that the marker is at the border of the board = END OF GAME
                                        console.log('gameOver nr 2');
                                        //scene.socket.emit('gameOver', false, isPlayer, scene.socket.id);
                                    }
                                    
                                } else {
                                    scene.markerOpponent.x = x + offset.x;
                                    scene.markerOpponent.y = y + offset.y;

                                    // show path
                                    let isPlayer = false;
                                    scene.socket.emit('pathPlaced', isPlayer, x, y, position, newPosition, scene.socket.id);
                                
                                    // update position of marker 
                                    scene.GameHandler.opponentMarkerPosition = this.swapNumbers(newPosition);
                                    position = scene.GameHandler.opponentMarkerPosition;
                                    console.log('new position after swapping: ', position);
        
                                    // update next index
                                    nextIndex = this.getCellsBorderingMarker(nextIndex, scene.dropZone, scene.markerOpponent.x, scene.markerOpponent.y, cellWidth, cellHeight);
                                    if(nextIndex !== null) {
                                        scene.GameHandler.opponentNextIndex = nextIndex;
                                        console.log('Bordering cell:', nextIndex);
                                    } else{
                                        console.log('gameOver nr 3');
                                        //scene.socket.emit('gameOver', false, isPlayer, scene.socket.id);
                                    }
                                    
                                    opponentMoved = true;
                                } 
                            }
                        }
                        // change to the opponent marker
                        position = scene.GameHandler.opponentMarkerPosition;

                        // break if game over or if opponent moved already
                        if(gameOver || position === 0 || i === 1 ) break;
                        
                        nextIndex = scene.GameHandler.opponentNextIndex;
                        //console.log('opponent next index ', nextIndex);
                        //console.log('player first next index ', index);

                        // if dropped card does not affect the opponent - break
                        if(nextIndex !== index) break;
                        //console.log('Bordering cell:', nextIndex);
                    }

                    // IMPLEMENT MOVE OF ENEMY MARKER IF YOU MAKE A MOVE
                    //console.log('end of while');

                    // emiting info
                    // index - index of the dropped cell
                    // rest of the parameters maybe are not necessary
                    scene.socket.emit(
                        'cardPlayed',
                        index,
                        gameObject.data.values.pairs,
                        gameObject.data.values.angle,
                        scene.GameHandler.playerMarkerPosition,
                        scene.GameHandler.opponentMarkerPosition,
                        gameObject.data.values.name,
                        scene.socket.id,
                        gameObject.x,
                        gameObject.y,
                        scene.markerPlayer.x,
                        scene.markerPlayer.y,
                        scene.markerOpponent.x,
                        scene.markerOpponent.y,
                        opponentMoved,
                        scene.GameHandler.playerNextIndex,
                        scene.GameHandler.opponentNextIndex
                    );
                    scene.takeCardButton.setInteractive();
                    scene.rotateCardsButton.disableInteractive();
                    
                }else{
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
                }
                
            }
            else{
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })
    }

    rotatePairsRight(array) {
        return array.map(pair => pair.map(num => (num + 2 > 8) ? num + 2 - 8 : num + 2));
    }

    rotatePairsLeft(array) {
        return array.map(pair => pair.map(num => (num - 2 < 1) ? num - 2 + 8 : num - 2));
    }

    isMarkerOnGridBorder(markerX, markerY, gridCenterX, gridCenterY, gridWidth, gridHeight) {
        // console.log("Marker X:", markerX);
        // console.log("Marker Y:", markerY);
        // console.log("Grid Center X:", gridCenterX);
        // console.log("Grid Center Y:", gridCenterY);
        // console.log("Grid Width:", gridWidth);
        // console.log("Grid Height:", gridHeight);

        const halfWidth = gridWidth / 2;
        const halfHeight = gridHeight / 2;
    
        // Check if the marker is on the left or right border
        if (markerX === gridCenterX - halfWidth || markerX === gridCenterX + halfWidth) {
            if(markerY > gridCenterY - halfHeight && markerY < gridCenterY + halfHeight){
                return true;
            }
        }

        if (markerY === gridCenterY - halfHeight || markerY === gridCenterY + halfHeight) {
            if(markerX > gridCenterX - halfWidth && markerX < gridCenterX + halfWidth){
                return true;
            }
        }
    
        return false;
    }

    getCellsBorderingMarker(index, dropZone, markerX, markerY, gridWidth, gridHeight) {
        for(let i = 0; i < 36; i++){
            let cell = dropZone.getChildren()[i];
            let isMarkerOnBorder = this.isMarkerOnGridBorder(markerX, markerY, cell.data.values.gridX, cell.data.values.gridY, gridWidth, gridHeight);
            if(isMarkerOnBorder && i !== index) return i;
        }
        return null;
    }
    
    getOtherNumber(pairs, number) {
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (pair.includes(number)) {
                return pair.find(num => num !== number);
            }
        }
        // If the number is not found in any pair, return null
        return null;
    }

    swapNumbers(number) {
        switch (number) {
            case 1:
                return 6;
            case 2:
                return 5;
            case 3:
                return 8;
            case 4:
                return 7;
            case 5:
                return 2;
            case 6:
                return 1;
            case 7:
                return 4;
            case 8:
                return 3;
            default:
                return number;
        }
    }
    
    
}