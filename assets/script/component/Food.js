import worker from 'worker';
import { getRandom } from 'tools';
import { SYS_OPEARTION } from 'actions';

cc.Class({
    extends: cc.Component,

    ctor() {
        // 时间
        this._time = 0;

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
        this._effect(dt);
    },

    onCollisionEnter(other) {
        const circleCollider = this.node.getComponent(cc.CircleCollider);
        circleCollider.enabled = false;

        this._time = 0;

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

    /* 
     * 动效
     * @param (number) dt 距离上一帧间隔时间
     */
    _effect(dt) {
        if (this._target === null) {
            return;
        }

        this._time += dt;

        const preVec = this.node.getPosition();
        const curVec = this._target.getPosition();
        const distance = cc.pDistance(curVec, preVec);

        if (distance > this._target.width / 2) {
            const subVec = cc.pSub(curVec, preVec);
            const _speed = distance * this._time;

            if (subVec.x < 0) {
                this.node.x += -_speed;
            } else {
                this.node.x += _speed;
            }

            if (subVec.y < 0) {
                this.node.y += -_speed;
            } else {
                this.node.y += _speed;
            }
        } else {
            worker.postMessage({
                cmd: SYS_OPEARTION.RECOVER_FOOD,
                data: {
                    foodId: this.node.uuid,
                    snakeId: this._target.snakeId
                }
            });
            
            this._target = null;
        }
    }
});