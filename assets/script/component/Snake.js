cc.Class({
    extends: cc.Component,

    ctor() {
        // 速度
        this._speed = 0;
        // 方向向量
        this._direction = {};

        // X轴移动最大范围
        this._rangeX = 0;
        // Y轴移动最大范围
        this._rangeY = 0;
    },

    properties: {

    },

    onLoad() {

    },

    start() {

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

    /* 
     * 移动
     * @param (number) dt 距离上一帧间隔时间
     */
    move(dt) {
        if (this._direction === null || this._speed === null) {
            return;
        }

        const _vec = cc.pNormalize(this._direction);

        this.node.x += _vec.x * this.node.width / this._speed * dt;
        this.node.y += _vec.y * this.node.width / this._speed * dt;

        if (Math.abs(this.node.x) >= this._rangeX) {
            this._direction.x = -_vec.x;
        }
        if (Math.abs(this.node.y) >= this._rangeY) {
            this._direction.y = -_vec.y;
        }
    }
});