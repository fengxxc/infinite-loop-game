import Block from "./Block"

export default class Board {
    private grids: Array<Array<Block>>;

    constructor() {
        this.grids = [[]]
    }

    public put(x: number, y: number, block: Block): void {
        if (this.grids[y] == null) {
            this.grids[y] = []
        }
        this.grids[y][x] = block
    }

    public get(x: number, y: number): Block | null {
        if (y < 0 || x < 0) {
            return null
        }
        if (y >= this.grids.length) {
            return null
        }
        if (x >= this.grids[y].length) {
            return null
        }
        return this.grids[y][x]
    }

    public isAllConnected(): boolean {
        for (let y = 0; y < this.grids.length; y++) {
            const row: Array<Block> = this.grids[y]
            for (let x = 0; x < row.length; x++) {
                const block = row[x];
                if (block == undefined) {
                    continue
                }
                if (x == 0) {
                    if (block.left) {
                        return false
                    }
                }
                if (y == 0) {
                    if (block.top) {
                        return false
                    }
                }
                if (x == row.length - 1) {
                    if (block.right) {
                        return false
                    }
                }
                if (y == this.grids.length - 1) {
                    if (block.bottom) {
                        return false
                    }
                }
                if (x != 0) {
                    if (!block.isNotBreakWithLeft(this.grids[y][x - 1])) {
                        return false
                    }
                }
                if (y != 0) {
                    if (!block.isNotBreakWithTop(this.grids[y - 1][x])) {
                        return false
                    }
                }
            }
        }
        return true
    }
}