export default class ZoneHandler {
    constructor(scene) {
        this.renderZone = (startX, startY) => {
            const gridSize = 6;
            const cellSize = 100;

            const dropZoneGroup = scene.add.group(); // Group to hold all cells

            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const x = startX + i * cellSize;
                    const y = startY + j * cellSize;
                    const dropZone = scene.add.zone(x, y, cellSize, cellSize).setRectangleDropZone(cellSize, cellSize);
                    dropZone.setData({
                        "cardId": null
                    });
                    dropZoneGroup.add(dropZone); // Add each cell to the group
                }
            }

            return dropZoneGroup; // Return the group containing all cells
        };

        this.renderOutline = (dropZoneGroup) => {
            const dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(2, 0xffffff, 0.4);

            // Draw outlines for each cell in the group
            dropZoneGroup.children.each(dropZone => {
                dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
            });
        };
    }
}
