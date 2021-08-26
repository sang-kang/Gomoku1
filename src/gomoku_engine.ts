export enum Stone {
    Black, White
}

export class GomokuEngine {
    public static readonly BOARD_SIZE = 19;         //객체 생성시 fields는 언제 만들어지나? 생성자 안에 인쓴 함수 다 부른후에?
    private stones: Stone[][];
    private currentTurn: Stone = Stone.Black;
    private isGameFinished: boolean = false;

    constructor() {
        this.initBoard();
        this.initEventHandler();
    }

    public getCurrentTurn(): Stone {
        return this.currentTurn;
    }

    public isGameOn(): boolean {
        return !this.isGameFinished;
    }

    private initBoard(): void {
        this.stones = [];
        for (let i = 0; i < GomokuEngine.BOARD_SIZE; i++) {
            this.stones[i] = []
            for (let j = 0; j < GomokuEngine.BOARD_SIZE; j++) {
                this.stones[i][j] = undefined;
            }
        }
    }

    private initEventHandler(): void {
        console.log("Initializing StonePlaced handler");
        document.body.addEventListener("PlaceStone", (event: CustomEvent) => {
            if (this.isGameFinished) {
                console.log("Game is already finished");
                return;
            }
            const x = event.detail.position.x;
            const y = event.detail.position.y;
            this.validateStonePosition(x, y);
            this.placeStoneAt(x, y);
            //this.check3by3(x, y);
            this.judgeGame(x, y);
        });
    }

    private validateStonePosition(x: number, y: number): void {     //놓냐 못놓냐를 판단하는 함수라 놓고 난뒤에 로직을 처리해야 하는 3*3이랑은 안어울린다?
        console.log(`Received StonePlaced for ${x}, ${y}`);
        if (x < 0 || x >= GomokuEngine.BOARD_SIZE) {
            throw `Incorrect board position received ${x}, ${y}`;
        }
        if (y < 0 || y >= GomokuEngine.BOARD_SIZE) {
            throw `Incorrect board position received ${x}, ${y}`;
        }
        if (this.stones[x][y] != undefined) {
            throw `Can't place stone as there's already stone on ${x}, ${y}`;
        }
        //TODO: valiate prohibited move 3 x 3       이렇게하면 안되는게 아직 돌 안만들었으니가.
        // if (this.check3by3(x, y)) {
        //     throw `3by3 is not allowed`;
        // }
    }

    private placeStoneAt(x: number, y: number): void {
        this.stones[x][y] = this.currentTurn;
        document.body.dispatchEvent(new CustomEvent("StonePlaced", {
            detail: {
                position: {x, y},
                stone: this.currentTurn
            }
        }));
        this.dumpBoard();
        this.currentTurn = this.currentTurn == Stone.Black ? Stone.White : Stone.Black;
    }

    private judgeGame(x: number, y: number): void {
        //judge if game has finished
        //announce winner if game is finished
        //update isGameFinished
        if (     //x, y 현재 바둑돌이 놓인 위치
            (this.getConnectedCount(x, y, 0, 1) + this.getConnectedCount(x, y, 0, -1) > 5) || // |np
            (this.getConnectedCount(x, y, 1, 0) + this.getConnectedCount(x, y, -1, 0) > 5) || // -
            (this.getConnectedCount(x, y, 1, 1) + this.getConnectedCount(x, y, -1, -1) > 5) || // /
            (this.getConnectedCount(x, y, 1, -1) + this.getConnectedCount(x, y, -1, 1) > 5) // \
        ) {
            this.isGameFinished = true;
            console.log(`${this.stones[x][y]} has won the game`);
            document.body.dispatchEvent(new CustomEvent("GameFinished", {detail: {winner: this.stones[x][y]}}));
        }
    }

    private getConnectedCount(x: number, y: number, xDelta: number, yDelta: number): number { // x, y, xDelta, yDelta를 입력으로 받아서count를 출력으로 내보내려고 한다.
        let count: number = 0;
        let currentX: number = x;
        let currentY: number = y;       //현재 바둑판에서 돌이 찍힌 위치 얻음
        let currentStone: Stone = this.stones[currentX][currentY];  //현재 좌표에서 찍혀있는 돌이 currentStone이라는 변수에 담겨짐
        while (this.stones[currentX][currentY] == currentStone) {
            count++;
            currentX += xDelta; //xDelta는 0이니까 currentX는 계속유지
            currentY += yDelta; //yDelta는 1이니까 currentY는 계속 위로 한칸씩 이동
        }
        return count;
    }

    private doesBlockingStoneExist(x: number, y: number, xDelta: number, yDelta: number): boolean {
        let currentX: number = x;
        let currentY: number = y;
        let currentStone: Stone = this.stones[currentX][currentY];  //현재 좌표에서 찍혀있는 돌이 currentStone이라는 변수에 담겨짐
        while (this.stones[currentX][currentY] == currentStone) {
            currentX += xDelta;
            currentY += yDelta;
        }
        let blockingStone: Stone = this.stones[currentX][currentY];
        if ((blockingStone == 0 || blockingStone == 1) && (blockingStone != currentStone)) {
            console.log(blockingStone);
            return true;                //blockingStone있네? 그럼 멈춰야지.
        }
        return false;                   //blockingStone 존재하지않음
    }

    private dumpBoard(): void {
        for (let i = 0; i < GomokuEngine.BOARD_SIZE; i++) {
            let line = " ";
            for (let j = 0; j < GomokuEngine.BOARD_SIZE; j++) {
                if (this.stones[j][i] == Stone.White) {
                    line += "W ";
                } else if (this.stones[j][i] == Stone.Black) {
                    line += "B ";
                } else {
                    line += ". ";
                }
            }
            console.log(line);
        }
    }
}