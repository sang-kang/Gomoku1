export abstract class Scene {
    protected readonly context: CanvasRenderingContext2D;
    protected readonly width: number;
    protected readonly height: number;

    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.context = context;
        this.context.font = '42px serif';
        this.width = width;
        this.height = height;
    }

    public draw(): void {
        //erase the pixels in a rectangular area  by setting them to transparent black. 이전 그림 내용 지운다.
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawScene();
        //draw()
        document.body.dispatchEvent(new CustomEvent("SceneChanged", {detail: {scene: this.name()}}));
    }

    protected changeScene(to: string): void {
        document.body.dispatchEvent(new CustomEvent("SceneChange", {detail: {scene: to}}));
        //detail은 event 초기화할때 넘겨지는 모든 데이터. 아마도 eventInitDict는 이벤트 초기화할때 받는 모든데이터인데 dictionaries형태로 받나보다.
        //{scene: to} 의 의미는 to값이 scene에 항당됨을 의미한다.
    }
    
    protected abstract drawScene(): void;
    public abstract name(): string;
    public abstract onClick(event: Event): void;
}