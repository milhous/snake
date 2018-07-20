cc.Class({
    extends: cc.Component,

    properties: {
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
     * 更新皮肤
     * @param (number) index 索引值
     */
    updateSkin(index) {
        const _sp = this.node.getComponent(cc.Sprite);
        _sp.spriteFrame = this.skin[index];
    }

    // update (dt) {},
});
