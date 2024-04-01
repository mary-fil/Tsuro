
let playerColor = 0xaa2200;

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

        scene.dealCardsButton.on('pointerdown', () => {
            if(scene.GameHandler.isMyTurn){
                scene.socket.emit('dealCards', scene.socket.id);
                scene.dealCardsButton.disableInteractive();
            }
            // scene.socket.emit('dealCards', scene.socket.id);
            // scene.dealCardsButton.disableInteractive();
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

        //markers
        scene.placeMarkersButton.on('pointerdown', () => {
            
            if (scene.GameHandler.isMyTurn) {
                scene.markerPlayer = scene.add.circle(250 - 25, 300, 10, playerColor);
                scene.markerPlayer.setStrokeStyle(2, 0x000000);

                scene.markerPlayer.type = 'marker';
                scene.markerPlayer.isPlaced = false;
                scene.markerPlayer.setInteractive({ draggable: true });
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

                        if (!(scene.GameHandler.opponentMarkerX === x && scene.GameHandler.opponentMarkerY === y)){
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
                let isMarkerOnBorder = this.isMarkerOnGridBorder(scene.GameHandler.playerMarkerX, scene.GameHandler.playerMarkerY, cell.data.values.gridX, cell.data.values.gridY, cellWidth, cellHeight);
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
                    scene.GameHandler.Board[index].push(gameObject.data.values.pairs);
                    console.log('gamehandler: ', scene.GameHandler.Board);

                    // move marker
                    // check path that marker can take
                    // offset table
                    // pairs table - find the second value of the pair and move marker to new location knowing the offset from the center of the grid x, y
                    let newPosition = this.getOtherNumber(gameObject.data.values.pairs, scene.GameHandler.playerMarkerPosition);
                    console.log('starting position: ', scene.GameHandler.playerMarkerPosition);
                    console.log('ending position: ', newPosition);

                    let offset = this.offsets[newPosition];
                    //console.log('offset: ', offset);

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
                    //console.log('Bordering cell:', nextIndex);

                    // game handler stores pairs that are currently on the cell, so 
                    // i can use this information when looking where to put the marker
                    // i dont need cardId anymore, just index of the grid

                    // i = 0 player, i = 1 opponent
                    let position = scene.GameHandler.playerMarkerPosition;
                    console.log('first position ', position);
                    let opponentMoved = false;
                    for(let i = 0; i < 2; i++){
                        console.log('i: ', i);

                        // if nextIndex === 0, this means that the marker is at the border of the board = END OF GAME
                        while(nextIndex !== 0){
                            console.log('while');
                            if(scene.GameHandler.Board[nextIndex].length === 0){
                                // cell is empty, there is no card yet
                                console.log('break');
                                break;
                            } else {
                                let pairsArray = scene.GameHandler.Board[nextIndex];
                                console.log('pairs: ', pairsArray);
                                let pairs = pairsArray[0];
    
                                let newPosition = this.getOtherNumber(pairs, position);
                                console.log('marker position: ', position);
    
                                console.log('new position: ', newPosition);
        
                                let offset = this.offsets[newPosition];
                                console.log('offset: ', offset);
        
                                //the center of the nearest grid cell
                                let cell = scene.dropZone.getChildren()[nextIndex];
                                let x = cell.data.values.gridX; // top left corner + halfwidth of cell (100)
                                let y = cell.data.values.gridY;
                                console.log('x: ', x);
                                console.log('y: ', y);
        
                                // move marker 
                                if(i === 0){
                                    scene.markerPlayer.x = x + offset.x;
                                    scene.markerPlayer.y = y + offset.y;
                                
                                    // update position of marker 
                                    scene.GameHandler.playerMarkerPosition = this.swapNumbers(newPosition);
        
                                    // update next index
                                    nextIndex = this.getCellsBorderingMarker(nextIndex, scene.dropZone, scene.markerPlayer.x, scene.markerPlayer.y, cellWidth, cellHeight);
                                    if(nextIndex) scene.GameHandler.playerNextIndex = nextIndex;
                                    console.log('Bordering cell:', nextIndex);
                                } else {
                                    scene.markerOpponent.x = x + offset.x;
                                    scene.markerOpponent.y = y + offset.y;
                                
                                    // update position of marker 
                                    scene.GameHandler.opponentMarkerPosition = this.swapNumbers(newPosition);
        
                                    // update next index
                                    nextIndex = this.getCellsBorderingMarker(nextIndex, scene.dropZone, scene.markerOpponent.x, scene.markerOpponent.y, cellWidth, cellHeight);
                                    if(nextIndex) scene.GameHandler.opponentNextIndex = nextIndex;
                                    opponentMoved = true;
                                    console.log('Bordering cell:', nextIndex);
                                } 
                            }
                        }
                        position = scene.GameHandler.opponentMarkerPosition;
                        if(position === 0 || i === 1 ) break;

                        // index needs to be different from the player
                        // TO DO - error when markers align and start from the same border
                        // when nextIndexPlayer === nextIndex
                        // something causes error, but i dont know when exactly
                        nextIndex = scene.GameHandler.opponentNextIndex;
                        console.log('opponent next index ', nextIndex);
                        console.log('player first next index ', nextIndexPlayer);
                        if(nextIndexPlayer !== nextIndex) break;

                        console.log('Bordering cell:', nextIndex);
                    }

                    // IMPLEMENT MOVE OF ENEMY MARKER IF YOU MAKE A MOVE
                    console.log('end of while');

                    // emiting info
                    // index - index of the dropped cell
                    // rest of the parameters maybe are not necessary
                    scene.socket.emit(
                        'cardPlayed',
                        index,
                        gameObject.data.values.pairs,
                        scene.GameHandler.playerMarkerPosition,
                        gameObject.data.values.name,
                        scene.socket.id,
                        gameObject.x,
                        gameObject.y,
                        scene.markerPlayer.x,
                        scene.markerPlayer.y,
                        scene.markerOpponent.x,
                        scene.markerOpponent.y,
                        opponentMoved,
                        scene.GameHandler.playerNextIndex
                    );
                    
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
        return 0;
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