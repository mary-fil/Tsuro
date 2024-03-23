
export default class InteractiveHandler{
    constructor(scene, placesGroup) {

        this.placesGroup = this.placesGroup;

        //scene.cardPreview = null;
        
        //cards
        scene.dealCards.on('pointerdown', () => {
            scene.socket.emit('dealCards', scene.socket.id);
            scene.dealCards.disableInteractive();
        })

        scene.dealCards.on('pointerover', () => {
            scene.dealCards.setColor('#336699');
        })

        scene.dealCards.on('pointerout', () => {
            scene.dealCards.setColor('#000000');
        })

        //markers
        scene.placeMarkers.on('pointerdown', () => {
            
            if (scene.GameHandler.isMyTurn) {
                scene.marker = scene.add.circle(200, 250, 10, 0x000000);
                scene.marker.type = 'marker';
                scene.marker.isPlaced = false;
                scene.marker.setInteractive({ draggable: true });
            }
        })

        scene.placeMarkers.on('pointerover', () => {
            scene.placeMarkers.setColor('#336699');
        })

        scene.placeMarkers.on('pointerout', () => {
            scene.placeMarkers.setColor('#000000');
        })

        scene.input.on('pointerover', (event, gameObjects) => {
            let pointer = scene.input.activePointer;
            if(gameObjects[0].type === "Image" && gameObjects[0].data.list.name !== "cardBack" ) {
                //scene.cardPreview = scene.add.image(pointer.worldX, pointer.worldY, gameObjects[0].data.values.sprite);
                const image = gameObjects[0];
                // Show highlight effect
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
                //scene.cardPreview.setVisible(false);
                // Hide highlight effect
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
            if(gameObject.name === "cardBack") {
                gameObject.setTint(0xff69b4);
                scene.children.bringToTop(gameObject);
                //scene.cardPreview.setVisible(false);
            } else {
                if (scene.highlightEffect) {
                    scene.highlightEffect.clear(); // Clear the highlight effect
                }
            }
        })

        scene.input.on('dragend', (pointer, gameObject, dropped) => {
            if(gameObject.name === "cardBack") {
                gameObject.setTint();
            }
            if(!dropped){
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        scene.input.on('drop', (pointer, gameObject, dropZone) => {
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
                            scene.socket.emit('markerMoved', gameObject, scene.socket.id);
                            console.log(droppedInValidPlace);
                        }
                    }
                });
                // If it wasn't dropped in a valid space, move it back to the start
                if (!droppedInValidPlace) {
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
                }
        
                // If the object is not a pawn, it must be a card
            } else if(scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready") {
                gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
                gameObject.y = dropZone.y;
                scene.dropZone.data.values.cards++;
                scene.input.setDraggable(gameObject, false);
                scene.socket.emit('cardPlayed', gameObject.data.values.name, scene.socket.id);
            }
            else{
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })
    }
}