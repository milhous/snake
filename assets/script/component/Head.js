import worker from 'worker';
import { SYS_OPEARTION } from 'actions';

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

    onLoad() {

    },

    start() {

    },

    onCollisionEnter(other) {
        const group = cc.game.groupList[other.node.groupIndex];

        if (other.node.parent.snakeId === this.node.snakeId) {
            return;
        }

        switch (group) {
            case 'probe':
                worker.postMessage({
                    cmd: SYS_OPEARTION.SNAKE_AVOID,
                    data: {
                        otherId: other.node.parent.snakeId,
                        selfId: this.node.snakeId
                    }
                });

                break;
            case 'body':

                break;
            case 'food':

                break;
            default:
        }
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