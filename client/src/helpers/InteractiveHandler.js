
export default class InteractiveHandler{
    constructor(scene, placesGroup) {

        this.placesGroup = this.placesGroup;

        scene.cardPreview = null;
        
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

        scene.input.on('pointerover', (event, gameObjects) => {
            let pointer = scene.input.activePointer;
            if(gameObjects[0].type === "Image") {//&& gameObjects[0].data.list.name !== "cardBack" 
                scene.cardPreview = scene.add.image(pointer.worldX, pointer.worldY, gameObjects[0].data.values.sprite);
            }
        })

        scene.input.on('pointerout', (event, gameObjects) => {
            if(gameObjects[0].type === "Image"){//&& gameObjects[0].data.list.name !== "cardBack"
                scene.cardPreview.setVisible(false);
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
                scene.cardPreview.setVisible(false);
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
            if (scene.GameHandler.isMyTurn && gameObject.type === 'pawn') {
                let droppedInValidPlace = false;
                placesGroup.children.each(space => {
                    let bounds = space.getBounds();
                    if (bounds.contains(pointer.x, pointer.y)) {
                        droppedInValidPlace = true;
                        gameObject.x = space.x;
                        gameObject.y = space.y;
                        space.disableInteractive();  // the place is occupied so disable it as a valid drop place
                        gameObject.disableInteractive();
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