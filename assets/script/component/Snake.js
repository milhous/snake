cc.Class({
    extends: cc.Component,

    ctor() {
        // 速度
        this._speed = 0;
        // 方向向量
        this._direction = {};
        // 长度为 1 的标准化过后的向量
        this._normalize = {};

        // X轴移动最大范围
        this._rangeX = 0;
        // Y轴移动最大范围
        this._rangeY = 0;

        // 起始长度
        this._initLen = 10;

        // 蛇头
        this._head = null;
        // 蛇身
        this._bodys = [];
    },

    properties: {
        headPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: '预制资源 - 蛇头'
        },
        bodyPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: '预制资源 - 蛇身'
        }
    },

    onLoad() {

    },

    start() {

    },

    /*
     * 初始化
     * @param (number) x X轴移动最大范围
     * @param (number) y Y轴移动最大范围
     */
    init({
        x,
        y
    }) {
        this.setMoveRange(this.node.width / 2, this.node.height / 2);

        this._createHead();

        this._createBody();
    },

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

        this._checkOutRange();
    },

    // 创建头部
    _createHead() {
        const _head = cc.instantiate(this.headPrefab);
        _head.zIndex = 100;
        _head.x = 0;
        _head.y = 0;
        this.node.addChild(_head);

        this._head = _head;
    },

    // 创建身体
    _createBody() {
        for (let i = 0; i < this._initLen; i++) {
            this._addBody();
        }
    },

    // 增加身体
    _addBody() {
        const _body = cc.instantiate(this.bodyPrefab);
        this._bodys.push(_body);
        _body.zIndex = 100 - this._bodys.length;
        _body.x = this._head.x;
        _body.y = this._head.y;
        _body.isMove = false;
        this.node.addChild(_body);
    },

    /*
     * 设置方向向量
     * @param (object) vec 向量
     */
    setDirectionVec(vec) {
        this._direction = vec;
    },

    /*
     * 设置速度
     * @param (number) speed 速度
     */
    setSpeed(speed) {
        this._speed = speed;
    },

    /*
     * 设置移动范围
     * @param (number) x X轴移动最大范围
     * @param (number) y Y轴移动最大范围
     */
    setMoveRange(x, y) {
        this._rangeX = x;
        this._rangeY = y;
    },

    // 获取蛇头位置
    getHeadPositon() {
        const _vec = this._head.convertToWorldSpaceAR(cc.Vec2.ZERO);

        return _vec;
    },

    // 获取活动区域
    getMoveRange() {
        const _vec = cc.v2(this.node.width, this.node.height);

        return _vec;
    },

    // 更新移动角度
    _updateHeadAngle() {
        const angle = cc.pToAngle(this._direction) / Math.PI * 180;

        this._head.rotation = -angle;
    },

    // 更新头部位置
    _updateHeadPosition() {
        this._normalize = cc.pNormalize(this._direction);

        this._head.x += this._normalize.x * this._head.width * this._speed;
        this._head.y += this._normalize.y * this._head.width * this._speed;
    },

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
    },

    // 检查是否超出边界
    _checkOutRange() {
        if (Math.abs(this._head.x) >= this._rangeX) {
            this._direction.x = -this._normalize.x;
        }
        if (Math.abs(this._head.y) >= this._rangeY) {
            this._direction.y = -this._normalize.y;
        }
    }
});