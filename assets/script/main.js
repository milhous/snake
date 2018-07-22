import mediator from 'mediator';
import {
    SPEED,
    SCENES
} from 'global';
import {
    SYS_OPEARTION
} from 'actions';

cc.Class({
    extends: cc.Component,

    ctor() {
        // 蛇
        this.snake = null;

        // 食堂
        this.canteen = null;
    },

    properties: {
        btnSpeed: {
            default: null,
            type: cc.Node,
            tooltip: '按钮 - 加速'
        },
        controler: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 方向控制器'
        },
        battlefield: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 战场'
        }
    },

    onLoad() {
        // 显示FPS信息
        cc.director.setDisplayStats(true);

        // 碰撞检测开启
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDrawBoundingBox = true;

        // 通信
        mediator.init();

        // 初始化组件
        this._initComponent();

        // 初始化组件数据连接
        this._initConnect();

        // 初始化事件
        this._initEvent();
    },

    start() {
        this._speedNormal();
    },

    update(dt) {
        mediator.update(dt);

        this.battlefield.updateState(dt);
    },

    lateUpdate(dt) {
        this.battlefield.updateCameraPosition();
    },

    // 初始化组件
    _initComponent() {
        // 战场
        this.battlefield = this.battlefield.getComponent('Battlefield');

        // 方向控制器
        this.controler = this.controler.getComponent('Controler');
    },

    // 初始化组件数据连接
    _initConnect() {
        // SYSTEM - 更新方向变量
        mediator.add({
            scene: SCENES.GAME,
            action: SYS_OPEARTION.UPDATE_DIRECTION,
            callback: (props) => {
                this.battlefield.setSnakeDirectionVec(props.vec);
            }
        });

        // SYSTEM - 回收食物
        mediator.add({
            scene: SCENES.GAME,
            action: SYS_OPEARTION.RECOVER_FOOD,
            callback: (props) => {
                this.battlefield.recoverFood(props.uuid);
            }
        });
    },

    // 初始化事件
    _initEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.controler.move, this.controler);
        this.node.on(cc.Node.EventType.TOUCH_END, this.controler.end, this.controler);

        this.btnSpeed.on(cc.Node.EventType.TOUCH_START, this._speedUp, this);
        this.btnSpeed.on(cc.Node.EventType.TOUCH_END, this._speedNormal, this);
    },

    // 加速
    _speedUp() {
        this.battlefield.setSnakeSpeed(SPEED.UP);
    },

    // 加速
    _speedNormal() {
        this.battlefield.setSnakeSpeed(SPEED.NORMAL);
    }
});