import Block, { BlockType } from "./block";

export default class Creater {
    public static create(top: Block | null, left: Block | null, hasRight: boolean, hasBottom: boolean): Block | null {
        let block = null
        if (top != null && left != null) {
            block = this.gen(top.bottom, left.right, hasRight, hasBottom)
        } else if (left != null) {
            block = this.gen(false, left.right, hasRight, hasBottom)
        } else if (top != null) {
            block = this.gen(top.bottom, false, hasRight, hasBottom)
        } else {
            block = this.gen(false, false, hasRight, hasBottom)
        }
        return block
    }

    static blockPool: Record<string, Block> = {
        b1_0: new Block(BlockType.B1, 0),
        b1_1: new Block(BlockType.B1, 1),
        b1_2: new Block(BlockType.B1, 2),
        b1_3: new Block(BlockType.B1, 3),
        b2_0: new Block(BlockType.B2, 0),
        b2_1: new Block(BlockType.B2, 1),
        b2_2: new Block(BlockType.B2, 2),
        b2_3: new Block(BlockType.B2, 3),
        b21_0: new Block(BlockType.B21, 0),
        b21_1: new Block(BlockType.B21, 1),
        b3_0: new Block(BlockType.B3, 0),
        b3_1: new Block(BlockType.B3, 1),
        b3_2: new Block(BlockType.B3, 2),
        b3_3: new Block(BlockType.B3, 3),
        b4_0: new Block(BlockType.B4, 0),
    }

    public static gen(connectTop: boolean, connectLeft: boolean, whateverRight: boolean, whateverBottom: boolean): Block | null {
        let randoms: string[] = []
        if (connectTop && connectLeft) {
            randoms = ["b2_3"]
            if (whateverRight && whateverBottom) {
                randoms = randoms.concat(["b3_0" , "b3_3", "b4_0"])
            } else if (whateverRight) {
                randoms = randoms.concat(["b3_0"])
            } else if (whateverBottom) {
                randoms = randoms.concat(["b3_3"])
            }
        } else if (connectTop) {
            randoms = ["b1_0"]
            if (whateverRight && whateverBottom) {
                randoms = randoms.concat(["b2_0", "b21_0", "b3_1"])
            } else if (whateverRight) {
                randoms = randoms.concat(["b2_0"])
            } else if (whateverBottom) {
                randoms = randoms.concat(["b21_0"])
            }
        } else if (connectLeft) {
            randoms = ["b1_3"]
            if (whateverRight && whateverBottom) {
                randoms = randoms.concat(["b2_2", "b21_1", "b3_2"])
            } else if (whateverRight) {
                randoms = randoms.concat(["b21_1"])
            } else if (whateverBottom) {
                randoms = randoms.concat(["b2_2"])
            }
        } else {
            randoms = []
            if (whateverRight && whateverBottom) {
                randoms = randoms.concat(["b1_1", "b1_2", "b2_1", ""])
            } else if (whateverRight) {
                randoms = randoms.concat(["b1_1"])
            } else if (whateverBottom) {
                randoms = randoms.concat(["b1_2"])
            }
        }
        if (randoms.length == 0) {
            return null;
        }
        const random: string = randoms[Math.floor(Math.random() * randoms.length)]
        if (random == "") {
            // 没有第一个
            return null;
        }
        const block = this.blockPool[random].clone()
        return block
    }
}