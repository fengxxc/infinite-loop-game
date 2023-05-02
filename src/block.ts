import Pos from "./Pos";

export enum BlockType {
    B1,
    B2,
    B21,
    B3,
    B4,
}

export default class Block {
    private _pos: Pos = new Pos(-1, -1);
    private _top: boolean = false;
    private _right: boolean = false;
    private _bottom: boolean = false;
    private _left: boolean = false;
    private _blockType!: BlockType;
    private _dir: number = 0; // 0: up; 1: right; 2: down: left; 3

    constructor(blocktype: BlockType, dir: number = 0) {
        this._blockType = blocktype;
        switch(blocktype) {
            case BlockType.B1:
                this.top = true
                break
            case BlockType.B2:
                this.top = true
                this.right = true
                break
            case BlockType.B21:
                this.top = true
                this.bottom = true
                break
            case BlockType.B3:
                this.top = true
                this.left = true
                this.right = true
                break
            case BlockType.B4:
                this.top = true
                this.left = true
                this.right = true
                this.bottom = true
                break
        }
        if (dir == 3) {
            this.spin(false)
        } else {
            for (let i = 0; i < dir; i++) {
                this.spin(true)
            }
        }
    }

    public get pos(): Pos {
        return this._pos;
    }
    public set pos(value: Pos) {
        this._pos = value;
    }
    public get top(): boolean {
        return this._top;
    }
    public set top(value: boolean) {
        this._top = value;
    }
    public get right(): boolean {
        return this._right;
    }
    public set right(value: boolean) {
        this._right = value;
    }
    public get bottom(): boolean {
        return this._bottom;
    }
    public set bottom(value: boolean) {
        this._bottom = value;
    }
    public get left(): boolean {
        return this._left;
    }
    public set left(value: boolean) {
        this._left = value;
    }
    public get blockType(): BlockType {
        return this._blockType;
    }
    public set blockType(value: BlockType) {
        this._blockType = value;
    }
    public get dir(): number {
        return this._dir;
    }
    public set dir(value: number) {
        this._dir = value;
    }

    /**
     * 旋转
     * @param clockwise 是否顺时针
     * @returns 本block
     */
    public spin(clockwise: boolean = true): Block {
        if (clockwise) {
            if (this.dir == 3) {
                this.dir = 0
            } else {
                this.dir += 1
            }
        } else {
            if (this.dir == 0) {
                this.dir = 3
            } else {
                this.dir -= 1
            }
        }
        const topTmp = this.top
        if (clockwise) {
            this.top = this.left
            this.left = this.bottom
            this.bottom = this.right
            this.right = topTmp
        } else {
            this.top = this.right
            this.right = this.bottom
            this.bottom = this.left
            this.left = topTmp
        }
        return this
    }

    public isNotBreakWithTop(topBlock: Block): boolean {
        if (!topBlock) {
            return !this.top
        }
        return this.top == topBlock.bottom
    }

    public isNotBreakWithLeft(leftBlock: Block): boolean {
        if (!leftBlock) {
            return !this.left
        }
        return this.left == leftBlock.right
    }

    public clone(): Block {
        return new Block(this.blockType, this.dir)
    }

}