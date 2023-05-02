import "./style.css";
// import * as PIXI from "pixi.js"
import {
    Application,
    Container,
    FederatedPointerEvent,
    ICanvas,
    Sprite,
    Texture
} from "pixi.js";
import Pos from "./Pos";
import Block, { BlockType } from "./Block";
import Creater from "./creater";
import Board from "./board";

const sprite2BlockMap: Map<Sprite, Block> = new Map()
let isAnimating = false;

function init(row: number, col: number) {
    const width = document.body.offsetWidth;
    const height = document.body.offsetHeight;
    const app: Application<ICanvas> = new Application({
        background: "#FCFCFC",
        width: width,
        height: height
    });
    document.body.appendChild(app.view as HTMLCanvasElement);
    const container = new Container();
    app.stage.addChild(container);

    const textureHome: Record<BlockType, Texture> = {
        [BlockType.B1]: Texture.from("/block_1.png"),
        [BlockType.B2]: Texture.from("/block_2.png"),
        [BlockType.B21]: Texture.from("/block_2-1.png"),
        [BlockType.B3]: Texture.from("/block_3.png"),
        [BlockType.B4]: Texture.from("/block_4.png")
    };
    const board: Board = new Board()
    for (let y = 0; y < row; y++) {
        for (let x = 0; x < col; x++) {
            const top: Block | null = board.get(x, y - 1)
            const left: Block | null = board.get(x - 1, y)
            const hasRight: boolean = x < col - 1
            const hasBottom: boolean = y < row - 1
            const block: Block | null = Creater.create(top, left, hasRight, hasBottom)
            if (block == null) {
                continue
            }
            block.pos = new Pos(x, y);

            const texture = textureHome[block.blockType]
            const blockSprite: Sprite = new Sprite(texture);
            blockSprite.anchor.set(0.5);
            const rotation = (Math.PI / 2) * block.dir
            blockSprite.rotation = rotation
            blockSprite.x = (x % col) * 128 - app.screen.width / 2 + 128;
            blockSprite.y = (y % row) * 128 - app.screen.height / 2 + 128;
            container.addChild(blockSprite);
            (blockSprite as any).interactive = true;
            (blockSprite as any).on("pointertap", (e: FederatedPointerEvent) => {
                if (isAnimating) {
                    return
                }
                isAnimating = true
                let startRotation = blockSprite.rotation;
                let endRotation = startRotation + Math.PI / 2;
                let duration = 240;
                let startTime = performance.now();
                let animate = (time: number) => {
                    let elapsedTime = time - startTime;
                    if (elapsedTime > duration) {
                        elapsedTime = duration;
                    }
                    let progress = elapsedTime / duration;
                    blockSprite.rotation = startRotation + progress * (endRotation - startRotation);
                    if (elapsedTime < duration) {
                        requestAnimationFrame(animate);
                    } else {
                        isAnimating = false
                    }
                };
                requestAnimationFrame(animate);

                const block: Block | undefined = sprite2BlockMap.get(e.currentTarget as any)
                if (block == undefined) {
                    return
                }
                block.spin(true)

                checkWin(board)

            });

            board.put(x, y, block)
            sprite2BlockMap.set(blockSprite, block)
        }
    }

    sprite2BlockMap.forEach((block, blockSprite) => {
        // 方向随机化
        randomization(block, blockSprite)
    })

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // app.ticker.add(delta => {
        // container.rotation -= 0.01 * delta;
    // });
}

function randomization(block: Block, blockSprite: Sprite) {
    const randomDir = Math.floor(Math.random() * 4)
    for (let i = 0; i < randomDir; i++) {
        block.spin()
    }
    blockSprite.rotation += (Math.PI / 2) * randomDir
}

function checkWin(board: Board) {
    const win: boolean = board.isAllConnected()
    // console.log(win)
    if (win) {
        setTimeout(() => {
            alert("you win~")
        }, 300);
    }
}

init(6, 4);
