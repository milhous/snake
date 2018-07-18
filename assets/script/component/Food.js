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
        console.log('on collision enter');

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;

        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;

        // 上一次计算的碰撞组件的 aabb 碰撞框
        var preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        var t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;
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