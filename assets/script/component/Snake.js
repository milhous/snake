export default class Snake {
    constructor() {
        this._snake = [];

        // 速度
        this._speed = 0;
        // 方向向量
        this._direction = null;
        // 长度为 1 的标准化过后的向量
        this._normalize = null;

        // X轴移动最大范围
        this._rangeX = 0;
        // Y轴移动最大范围
        this._rangeY = 0;
    }

    /*
     * 初始化
     * @param (number) snake 
     * @param (number) initX X轴位置
     * @param (number) initY Y轴位置
     * @param (number) rangeX X轴移动范围
     * @param (number) rangeY Y轴移动范围
     */
    init({
        snake,
        initX,
        initY,
        rangeX,
        rangeY
    }) {
        this._snake = snake;

        this.setMoveRange(rangeX, rangeY);

        this._setInitPosition(initX, initY);
    }

    /*
     * 设置初始位置
     * @param (number) x X轴移动范围
     * @param (number) y Y轴移动范围
     */
    _setInitPosition(x, y) {
        const _index = 100;

        this._snake.map((part, index) => {
            part.zIndex = 100 - index;
            part.x = x;
            part.y = y;
        });
    }

    /*
     * 设置移动范围
     * @param (number) rangeX X轴移动最大范围
     * @param (number) rangeY Y轴移动最大范围
     */
    setMoveRange(rangeX, rangeY) {
        this._rangeX = x;
        this._rangeY = y;
    }

    // 更新头部位置
    _updateHeadPosition() {
        this._normalize = cc.pNormalize(this._direction);

        const _x = this._head.x + this._normalize.x * this._head.width * this._speed;
        const _y = this._head.y + this._normalize.y * this._head.width * this._speed;
        const _vec = this._checkOutRange(_x, _y);

        this._head.setPosition(_vec);
    }

    // 更新身体位置
    _updateBodyPosition() {
        this._bodys.map((body, index, arr) => {
            const curVec = index === 0 ? this._head.getPosition() : arr[index - 1].getPosition();
            const preVec = body.getPosition();
            const subVec = cc.pSub(curVec, preVec);

            if (!body.isMove) {
                const distance = cc.pDistance(curVec, preVec);

                if (distance >= body.width / 2) {
                    body.isMove = true;
                }
            }

            if (body.isMove) {
                body.x += subVec.x * this._speed;
                body.y += subVec.y * this._speed;
            }
        });
    }

    // 更新移动角度
    _updateHeadAngle() {
        const angle = cc.pToAngle(this._direction) / Math.PI * 180;

        this._head.rotation = -angle;
    }

    /*
     * 检查是否超出边界
     * @param (number) x X轴位置
     * @param (number) y Y轴位置
     */
    _checkOutRange(x, y) {
        const _vec = cc.v2(x, y);

        if (_vec.x > this._rangeX) {
            _vec.x = this._rangeX;
        }

        if (_vec.x < -this._rangeX) {
            _vec.x = -this._rangeX;
        }

        if (_vec.y > this._rangeY) {
            _vec.y = this._rangeY;
        }

        if (_vec.y < -this._rangeY) {
            _vec.y = -this._rangeY;
        }

        if (Math.abs(_vec.x) >= this._rangeX) {
            this._direction.x = -this._normalize.x;
        }

        if (Math.abs(_vec.y) >= this._rangeY) {
            this._direction.y = -this._normalize.y;
        }

        return _vec;
    }
});