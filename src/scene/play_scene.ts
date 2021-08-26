import {Scene} from "./scene";
import arrayContaining = jasmine.arrayContaining;
import {GomokuEngine, Stone} from "../gomoku_engine";

interface Position {
    x: number;
    y: number;
}

export class PlayScene extends Scene {
    public static readonly SCENE_NAME = "play";
    private engine: GomokuEngine;
    private checkBoardWidth;
    private checkBoardHeight;
    private clientWidth: number;
    private clientHeight: number;
    private gridUnitSize: number;

//    private checkBoardMatrix: number[][] = [[], []];


    constructor(context: CanvasRenderingContext2D, width: number, height: number, clientWidth: number, clientHeight: number, engine: GomokuEngine) {
        super(context, width, height);
        this.engine = engine;
        this.clientWidth = clientWidth;
        this.clientHeight = clientHeight;
        this.initHandler();
    }

    private initHandler(): void {
        document.body.addEventListener("GameFinished", (event: CustomEvent) => {
            this.context.font = '42px serif';
            this.context.fillStyle = 'RGB(30, 63, 90)';
            const winner = event.detail.winner == Stone.Black ? 'Black' : 'White';
            this.context.fillText(`${winner} won!!`, (this.clientWidth / 2) - 200, (this.clientHeight / 2) - 20, this.width - 50);
        });

        document.body.addEventListener("StonePlaced", (event: CustomEvent) => {
            let stone = new Path2D();
            const x = event.detail.position.x + 1;
            const y = event.detail.position.y + 1;
            stone.arc(
                x * this.gridUnitSize,
                y * this.gridUnitSize,
                this.gridUnitSize / 2, 0,
                Math.PI * 2);
            this.context.fillStyle = event.detail.stone == Stone.Black ? 'black' : 'white';
            this.context.fill(stone);
        });

        //3by3에 대한 이벤트. 내가 추가.
        // document.body.addEventListener("3by3Occurrences", (event: CustomEvent) => {
        //     alert('3by3 is not allowed');
        //     //해당부분 안찍혀야 되는데 경고창 띄워지고 난 다음에 찍히네. 안찍히게 하려면 어떻게?
        // });


    }

    drawScene(): void {
        this.drawBoard();
    }


    private drawHorizontalAndVerticalLines() {
        this.context.fillStyle = '#d1946c';

        const gridSize: number = (this.clientWidth > this.clientHeight) ? this.height : this.width;
        this.gridUnitSize = gridSize / 20;    //바둑판은 가로 세로 각각 18개씩으로 이루어져있음. 그리고 좌우 여백도 같은 크기라 가정.

        for (var x = this.gridUnitSize; x < gridSize; x += this.gridUnitSize) {
            this.context.moveTo(x, this.gridUnitSize);
            this.context.lineTo(x, gridSize - this.gridUnitSize);
            this.context.moveTo(this.gridUnitSize, x);
            this.context.lineTo(gridSize - this.gridUnitSize, x);
        }

        this.context.fillRect(0, 0, gridSize, gridSize);

        this.context.strokeStyle = 'black';
        this.context.stroke();
        //바둑판 사이즈 가져오려고.
        this.checkBoardHeight = this.checkBoardWidth = gridSize;

        this.makeFlowerPoints(this.gridUnitSize);
    }

    private makeFlowerPoints(increment: number) {
        //바둑판 중간 중간 굵은 원 그리기
        let circle = new Path2D();
        circle.arc(increment * 4, increment * 4, 5, 0, Math.PI * 2);
        circle.arc(increment * 10, increment * 4, 5, 0, Math.PI * 2);
        circle.arc(increment * 16, increment * 4, 5, 0, Math.PI * 2);

        let circle2 = new Path2D();
        circle2.arc(increment * 4, increment * 10, 5, 0, Math.PI * 2);
        circle2.arc(increment * 10, increment * 10, 5, 0, Math.PI * 2);
        circle2.arc(increment * 16, increment * 10, 5, 0, Math.PI * 2);

        let circle3 = new Path2D();
        circle3.arc(increment * 4, increment * 16, 5, 0, Math.PI * 2);
        circle3.arc(increment * 10, increment * 16, 5, 0, Math.PI * 2);
        circle3.arc(increment * 16, increment * 16, 5, 0, Math.PI * 2);
        this.context.fillStyle = 'black';
        this.context.fill(circle);
        this.context.fill(circle2);
        this.context.fill(circle3);
    }

    private drawBoard(): void {
        this.drawHorizontalAndVerticalLines();
    }

    public name(): string {
        return PlayScene.SCENE_NAME;
    }

    public onClick(event: MouseEvent): void {
        console.log(`${event.pageX}, ${event.pageY} has clicked`);
        const rect = document.body.getBoundingClientRect();
        const x = event.x / rect.width * this.checkBoardWidth;
        const y = event.y / rect.height * this.checkBoardHeight;
        console.log(`local coordinate ${x}, ${y}`);
        if (!this.isOnBoard(x, y)) {  //if click was outside of board, don't do any
            return;
        }
        if (this.engine.isGameOn()) {
            this.placeStone({x, y});
        }
    }

    private isOnBoard(x: number, y: number): boolean {
        if (x < this.checkBoardWidth && y < this.checkBoardHeight) {
            console.log('is inside');
            return true;
        } else {
            console.log('is outside');
            return false;
        }
    }

    //좌표 찍은 곳에 돌 그리기. 돌 색상은 currentStone에 있는데 enum으로 되어있음.
    //좌표통해서 주면 0~18로
    private placeStone(position: Position) {
        const x = Math.round(position.x / this.gridUnitSize) - 1;
        const y = Math.round(position.y / this.gridUnitSize) - 1;
        document.body.dispatchEvent(new CustomEvent("PlaceStone", {detail: {position: {x: x, y: y}}}));
    }

}