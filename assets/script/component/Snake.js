export default class Snake {
    constructor() {
        this._snake = [];

        // 速度
        this._speed = null;
        // 方向向量
        this._direction = null;
        // 长度为 1 的标准化过后的向量
        this._normalize = null;
        // 皮肤索引值
        this._skinIndex = 0;

        // 成长值
        this._growth = 0;

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
     * @param (number) speed 速度
     * @param (object) direction 方向向量
     */
    init({
        snake,
        initX,
        initY,
        rangeX,
        rangeY,
        speed,
        direction
    }) {
        this._snake = snake;

        this._setInitPosition(initX, initY);

        this.setMoveRange(rangeX, rangeY);

        this.setSpeed(speed);

        this.setDirection(direction);
    }

    /* 
     * 移动
     * @param (number) dt 距离上一帧间隔时间
     */
    move(dt) {
        if (this._direction === null || this._speed === null) {
            return;
        }

        this._updateHeadAngle();

        this._updateHeadPosition();

        this._updateBodyPosition();

        cc.log(this._direction);
    }

    /*
     * 增加身体
     * @param (object) body 身体
     */
    add(body) {
        const _len = this._snake.length;

        body.zIndex = 100 - _len;
        body.x = this._snake[_len - 1].x;
        body.y = this._snake[_len - 1].y;

        const bodyComp = body.getComponent('Body');
        bodyComp.updateSkin(this._skinIndex);

        this._snake.push(body);
    }

    /*
     * 增加成长值
     * @param (number) growth 成长值
     */
    addGrowth(growth = 1) {
        this._growth += growth;
    }

    /*
     * 设置成长值
     * @param (number) growth 成长值
     */
    setGrowth(growth = 0) {
        this._growth = growth;
    }

    // 获取成长值
    getGrowth() {
        return this._growth;
    }

    // 获取长度
    getLength() {
        return this._snake.length - 1;
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
        this._rangeX = rangeX;
        this._rangeY = rangeY;
    }

    /*
     * 设置方向向量
     * @param (object) vec 向量
     */
    setDirection(vec) {
        this._direction = vec;
    }

    // 获取方向向量
    getDirection(vec) {
        return this._direction;
    }

    /*
     * 设置速度
     * @param (number) speed 速度
     */
    setSpeed(speed) {
        this._speed = speed;
    }

    /*
     * 设置皮肤
     * @param (number) skinIndex 皮肤索引值
     */
    setSkin(skinIndex) {
        this._skinIndex = skinIndex;

        this._snake.map((part, index) => {
            let partComp = null;

            if (index > 0) {
                partComp = part.getComponent('Body');
            } else {
                partComp = part.getComponent('Head');
            }

            partComp.updateSkin(skinIndex);
        });
    }

    // 获取蛇头位置
    getHeadPositon() {
        const _head = this._snake[0];
        const _vec = _head.convertToWorldSpaceAR(cc.Vec2.ZERO);

        return _vec;
    }

    /*
     * 获取身体部位
     * @param (number) index 索引值
     */
    getPartByIndex(index) {
        let _node = null;

        if (typeof this._snake[index] !== 'undefined') {
            _node = this._snake[index];
        }

        return _node;
    }

    // 更新头部位置
    _updateHeadPosition() {
        const _head = this._snake[0];
        this._normalize = cc.pNormalize(this._direction);

        const _x = _head.x + this._normalize.x * _head.width * this._speed;
        const _y = _head.y + this._normalize.y * _head.width * this._speed;
        const _vec = this._checkOutRange(_x, _y);

        _head.setPosition(_vec);
    }

    // 更新身体位置
    _updateBodyPosition() {
        this._snake.map((body, index, arr) => {
            // 头部索引值等于0
            if (index > 0) {
                const curVec = arr[index - 1].getPosition();
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
            }
        });
    }

    // 更新移动角度
    _updateHeadAngle() {
        const _head = this._snake[0];
        const angle = cc.pToAngle(this._direction) / Math.PI * 180;

        _head.rotation = -angle;
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
}