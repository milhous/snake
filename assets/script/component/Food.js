cc.Class({
    extends: cc.Component,

    properties: {
        skin: {
            default: [],
            type: [cc.SpriteFrame],
            tooltip: 'SpriteFrame - 食物皮肤'
        }
    },

    onLoad() {

    },

    start() {

    },

    onCollisionEnter(other, self) {
        self.node.active = false;
    },

    // 更新皮肤
    updateSkin() {
        const _index = this._getRandom(0, this.skin.length);
        const _sp = this.node.getComponent(cc.Sprite);
        _sp.spriteFrame = this.skin[_index];
    },

    // update (dt) {},

    // 获取随机数
    _getRandom(n, m) {
        return Math.round(Math.random() * (m - n) + n);
    }
});