//handling all user interface stuff

export class UIHandler {

    constructor (scene)
    {
        this.buildGameText = () => {
            scene.dealCards = scene.add.text(960, 445, "Deal cards").setFontSize(14).setFontFamily("Trebuchet MS");
        }

        this.buildUI = () => {
            this.buildGameText();
        }
    }
}