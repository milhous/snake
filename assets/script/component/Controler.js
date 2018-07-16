cc.Class({
    extends: cc.Component,

    ctor() {
        this._centerVec = null;
    },

    properties: {
        rocker: {
            default: null,
            type: cc.Node,
            tooltip: '摇杆'
        }
    },

    onLoad() {
        this._getCenterVec();
    },

    start() {

    },

    // 获取控制器中心点
    _getCenterVec() {
        this._centerVec = new cc.Vec2(0, 0);

        console.log(this._centerVec);
    },

    // 移动控制点
    move(evt) {
        const touches = evt.getTouches();
        const touchLoc = touches[0].getLocation();
        const touchPoint = this.node.convertToNodeSpace(touchLoc);

        // 设置控制点 限制超出父节点
        const subVec = cc.pSub(touchPoint, this._centerVec);

        if (cc.pDistance(touchPoint, this._centerVec) > this.node.width / 2) {
            const nv = cc.pNormalize(subVec);

            this.rocker.x = this._centerVec.x + nv.x * this.node.width / 2;
            this.rocker.y = this._centerVec.y + nv.y * this.node.width / 2;
        } else {
            this.rocker.setPosition(touchPoint);
        }
    },

    // 松开时回复控制点到中点
    end(evt) {
        this.rocker.setPosition(this._centerVec);
    }
});