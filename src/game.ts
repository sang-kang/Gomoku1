import {GomokuEngine} from "./gomoku_engine";
import {MainScene} from "./scene/main_scene";
import {PlayScene} from "./scene/play_scene";
import {Scene} from "./scene/scene";

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private currentSceneName: string;
    private readonly sceneMap: { [name: string]: Scene } = {};  //name은 key, Scene은 value
    private engine: GomokuEngine = new GomokuEngine();

    constructor() {
        console.log("Initializing Game");
        this.initCanvas();
        this.initControl();
        this.initScenes();
    }

    public start(): void {
        this.sceneMap[MainScene.SCENE_NAME].draw();
    }

    private initCanvas(): void {
        document.body.style.margin = "0px";
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1024;   //1920
        this.canvas.height = 1024;  //1000
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.id = "gameCanvas";
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d");
    }

    private initScenes() {
        [
            new MainScene(this.context, this.canvas.width, this.canvas.height),
            new PlayScene(this.context, this.canvas.width, this.canvas.height, this.canvas.clientWidth, this.canvas.clientHeight, this.engine)
        ].forEach(scene => this.sceneMap[scene.name()] = scene);
    }

    private initControl() {
        document.body.addEventListener("SceneChanged", (event: CustomEvent) => {    //dom의 특정요소에 이벤트 등록할 때 사용. body에 SceneChanged라는 함수가 발생하면 event를 파라미터로 하는 함수를 실행하라
            this.currentSceneName = event.detail.scene;
            console.log(`Received SceneChanged for ${this.currentSceneName}`);
        });

        document.body.addEventListener("SceneChange", (event: CustomEvent) => {
            const newSceneName = event.detail.scene;
            console.log(`Received SceneChange request for ${newSceneName}`);
            this.sceneMap[newSceneName].draw(); //sceneMap에서 newSceneName key가진 놈 찾아서 이 Scene객체의 draw함수 호출
        });

        this.canvas.addEventListener('click', (event) => {
            console.log('clicked');
            this.sceneMap[this.currentSceneName].onClick(event);        //sceneMap이라는 Map은 key는 name, value로는 Scene을 가진다.
                                                                        //마우스 click하면 현재scceneName(main)의 Scene의 onClick함수 실행한다. 이때 파라미터로 event넘겨준다
                                                                        //Scene에 들어가보면 onCLick함수는 abstract함수로 상속받는 클래스가 구현해야한다. MainScene 클래스 보면 구현되어져 있는데
                                                                        //changeScene함수를 호출한다. 이때 파라미터로 PlayScene.SCENE_NAME을 넘겨주는데 이는 play이다.
                                                                        //Scene클래스로 가서 changeScene함수를 보면 play를 파라미터로 받으며, body에 새로운 event를 붙인다. JS에 정해져 있지 않은 새로운 이밴트를 붙일때는 new CustomEvent를 통해 방색시키며, 이렇게 만들어진 new CoustomEvent객체를 파라미터로 dispatchEvent함수를 통해 body에 붙여준다
        });
    }
}