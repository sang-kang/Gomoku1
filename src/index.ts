import { Game } from "./game";

document.body.onload = () => {
    console.log("Starting");
    new Game().start();
}