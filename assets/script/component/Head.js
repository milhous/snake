cc.Class({
    extends: cc.Component,

    properties: {
        viewCollider: {
            default: null,
            type: cc.BoxCollider,
            tooltip: '视野范围'
        },
        skin: {
            default: [],
            type: [cc.SpriteFrame],
            tooltip: 'SpriteFrame - 皮肤'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    /*
     * 设置视野碰撞范围
     * @param (number) width 宽
     * @param (number) height 高
     */
    setViewRange(width, height) {
        this.viewCollider.size = cc.size(width, height);
    },

    /*
     * 更新皮肤
     * @param (number) index 索引值
     */
    updateSkin(index) {
        const _sp = this.node.getComponent(cc.Sprite);
        _sp.spriteFrame = this.skin[index];
    }

    // update (dt) {},
});
