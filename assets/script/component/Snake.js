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
        this._initLen = 5;

        // 摄像机
        this._camera = null;
        // 蛇身
        this._bodys = [];

        // 移动里程
        this._mileage = 0;
        // 移动足迹
        this._footmark = [];
    },

    properties: {
        head: {
            default: null,
            type: cc.Node,
            tooltip: '节点 - 蛇头'
        },
        bodyPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: '预制资源 - 蛇身'
        }
    },

    onLoad() {
        this.node.zIndex = 100;
    },

    start() {

    },

    // 初始化
    init({
        x,
        y,
        camera
    }) {
        this._camera = camera;

        this.setMoveRange(x, y);

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

        this._updatePosition(dt);

        this._updateHeadAngle();

        this._checkOutRange();
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
        _body.startIndex = -1;
        this.node.parent.addChild(_body);
    },

    // 移动身体
    _moveBody() {
        const _arr = Array.from(this._footmark);
        const _len = _arr.length;
        const _num = Math.floor(this._mileage / this.bodyPrefab.data.width);

        this._bodys.map((body, index) => {
            if (index === _num - 1 && body.startIndex === -1) {
                body.startIndex = _len - 1;
            }

            if (body.startIndex !== -1) {
                const _pos = _arr[body.startIndex];

                body.x = _pos.x;
                body.y = _pos.y;
            }
        });
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

    // 更新移动角度
    _updateHeadAngle() {
        const angle = cc.pToAngle(this._direction) / Math.PI * 180;

        this.head.rotation = -angle;
    },

    /* 
     * 更新位置
     * @param (number) dt 距离上一帧间隔时间
     */
    _updatePosition(dt) {
        this._normalize = cc.pNormalize(this._direction);

        const lastVec = cc.v2(this.node.x, this.node.y);

        this.node.x += this._normalize.x * this.node.width / this._speed * dt;
        this.node.y += this._normalize.y * this.node.width / this._speed * dt;

        const curVec = cc.v2(this.node.x, this.node.y);

        this._mileage += cc.pDistance(curVec, lastVec);

        this._recordFootmark(this.node.x, this.node.y);

        this._moveBody();
    },

    // 检查是否超出边界
    _checkOutRange() {
        if (Math.abs(this.node.x) >= this._rangeX) {
            this._direction.x = -this._normalize.x;
        }
        if (Math.abs(this.node.y) >= this._rangeY) {
            this._direction.y = -this._normalize.y;
        }
    },

    /*
     * 记录足迹
     * @param (number) x X轴坐标
     * @param (number) y Y轴坐标
     */
    _recordFootmark(x, y) {
        this._footmark.unshift({
            x: x,
            y: y
        });
    }
});