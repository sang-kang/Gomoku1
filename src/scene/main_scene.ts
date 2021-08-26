import { PlayScene } from "./play_scene";
import { Scene } from "./scene";

export class MainScene extends Scene{
    public static readonly SCENE_NAME = "main";


    drawScene(): void {
        this.context.fillText("click screen to start game", 50, 50, this.width - 50);
    }

    public name(): string {
        return MainScene.SCENE_NAME;
    }

    public onClick(event: Event): void {
        this.changeScene(PlayScene.SCENE_NAME);
    }
}