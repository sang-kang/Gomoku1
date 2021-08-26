import { Scene } from "../scene/scene";

export class SceneChangedEvent extends Event {
    private to: Scene;

    constructor(type: string, to:Scene, eventInitDict?: EventInit) {
        super(type, eventInitDict);
        this.to = to;
    }

}