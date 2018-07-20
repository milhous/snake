import worker from 'worker';
import { getRandom } from 'tools';
import { SYS_OPEARTION } from 'actions';

cc.Class({
    extends: cc.Component,

    ctor() {
        // 移动速度
        this._speed = 4.2;

        // 目标
        this._target = null;
    },

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

    update(dt) {
        this._effect();
    },

    onCollisionEnter(other, self) {
        const circleCollider = self.node.getComponent(cc.CircleCollider);
        circleCollider.enabled = false;

        this._target = other.node;
    },

    // 更新皮肤
    updateSkin() {
        const _index = getRandom(0, this.skin.length);
        const _sp = this.node.getComponent(cc.Sprite);
        _sp.spriteFrame = this.skin[_index];
    },

    // 开启碰撞检测
    openCollision() {
        const circleCollider = this.node.getComponent(cc.CircleCollider);
        circleCollider.enabled = true;
    },

    // 动效
    _effect() {
        if (this._target === null) {
            return;
        }

        const preVec = this.node.getPosition();
        const curVec = this._target.getPosition();
        const distance = cc.pDistance(curVec, preVec);

        if (distance > this._target.width / 2) {
            const subVec = cc.pSub(curVec, preVec);

            if (subVec.x < 0) {
                this.node.x += -this._speed;
            } else {
                this.node.x += this._speed;
            }

            if (subVec.y < 0) {
                this.node.y += -this._speed;
            } else {
                this.node.y += this._speed;
            }
        } else {
            this._target = null;

            worker.postMessage({
                cmd: SYS_OPEARTION.RECOVER_FOOD,
                data: {
                    uuid: this.node.uuid
                }
            });
        }
    }
});