import "./style.css";
// import * as PIXI from "pixi.js"
import {
    Application,
    BLEND_MODES,
    Container,
    FederatedPointerEvent,
    ICanvas,
    ParticleContainer,
    Sprite,
    Texture
} from "pixi.js";
import Pos from "./pos";
import Block, { BlockType } from "./block";
import Creater from "./creater";
import Board from "./board";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
        <h1>infinite loop game</h1>
        <p>
            <button id="counter" type="button">refresh</button>
        </p>
    </div>
`

const sprite2BlockMap: Map<Sprite, Block> = new Map()
let isAnimating = false;
const width = document.body.offsetWidth * 0.9;
const height = document.body.offsetHeight - document.querySelector<HTMLDivElement>('#app')!.offsetHeight - 10;
const app: Application<ICanvas> = new Application({
    background: "#FCFCFC",
    width: width,
    height: height
});
document.querySelector<HTMLDivElement>('#app')!.appendChild(app.view as HTMLCanvasElement);

function init(row: number, col: number) {
    const container = new Container<Sprite>();
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
            blockSprite.x = (x % col) * 128 - app.screen.width / 3 + 96;
            blockSprite.y = (y % row) * 128 - app.screen.height / 2 + 74;
            blockSprite.blendMode = BLEND_MODES.MULTIPLY;
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

                if (isWin(board)) {
                    celebrate(app)
                }

            });
            container.addChild(blockSprite);

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

function isWin(board: Board): boolean {
    const win: boolean = board.isAllConnected()
    // console.log(win)
    return win
}

function celebrate(app: Application<ICanvas>) {
    // alert("you win~")
    const container = new ParticleContainer()
    for (let i = 0; i < 100; i++) {
        const particle = new Sprite(Texture.WHITE);
        particle.tint = Math.random() * 0xffffff;
        particle.width = Math.random() * 10 + 4;
        particle.height = Math.random() * 10 + 6;
        particle.anchor.set(0.5)
        particle.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height * 2 - app.screen.height * 2);
        container.addChild(particle);
    }
    app.stage.addChild(container);
    app.ticker.add(() => {
        for (let i = 0; i < container.children.length; i++) {
            const particle = container.children[i];
            particle.position.y += Math.random() * 10 + 7;
            particle.rotation += Math.random() * 0.3 /* * (Math.round(Math.random()) ? 1 : -1) */
            if (particle.position.y > app.screen.height) {
                particle.destroy()
                container.removeChild(particle);
            }
        }
        if (container.children.length == 0) {
            container.destroy()
        }
    });
}

// refresh 
document.querySelector<HTMLButtonElement>('#counter')!.addEventListener('click', () => {
    app.stage.children.forEach(container => {
        container.destroy()
    })
    sprite2BlockMap.clear()
    init(3, 3)
})

init(3, 3);
