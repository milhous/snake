import mediator from 'mediator';
import { SCENES } from 'global';
import { SYS_OPEARTION } from 'actions';

cc.Class({
    extends: cc.Component,

    ctor() {
        // 加速度
        this._speed = 0.12;

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
        },
        camera: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 摄像机'
        }
    },

    onLoad() {
        // 显示FPS信息
        cc.director.setDisplayStats(false);

        // 碰撞检测开启
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDrawBoundingBox = true;

        mediator.init();

        this.initComponent();

        this.initConnect();

        this.initEvent();
    },

    start() {

    },

    update(dt) {
        mediator.update(dt);

        this.snake.move(dt);
    },

    lateUpdate(dt) {
        this.updateCameraPosition();
    },

    // 初始化组件
    initComponent() {
        // 食品工厂
        this.factory = this.battlefield.getComponent('Factory');
        this.initCanteen();

        // 蛇
        this.snake = this.battlefield.getComponent('Snake');
        this.initSnake();

        // 方向控制器
        this.controler = this.controler.getComponent('Controler');

        // 摄像机
        this.camera = this.camera.getComponent(cc.Camera);
    },

    // 初始化组件数据连接
    initConnect() {
        // SYSTEM - 更新方向变量
        mediator.add({
            scene: SCENES.GAME,
            action: SYS_OPEARTION.UPDATE_DIRECTION,
            callback: (props) => {
                this.snake.setDirectionVec(props.vec);
            }
        });

        // SYSTEM - 回收食物
        mediator.add({
            scene: SCENES.GAME,
            action: SYS_OPEARTION.RECOVER_FOOD,
            callback: (props) => {
                this.recoverFood(props.uuid);
            }
        });
    },

    // 初始化事件
    initEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.controler.move, this.controler);
        this.node.on(cc.Node.EventType.TOUCH_END, this.controler.end, this.controler);

        this.btnSpeed.on(cc.Node.EventType.TOUCH_START, this.speedUp, this);
        this.btnSpeed.on(cc.Node.EventType.TOUCH_END, this.speedNormal, this);
    },

    // 初始蛇
    initSnake() {
        this.snake.init({
            x: this.node.width / 2,
            y: this.node.height / 2
        });

        this.snake.setDirectionVec(cc.v2(100 * cc.randomMinus1To1(), 100 * cc.randomMinus1To1()));

        this.snake.setSpeed(this._speed);
    },

    // 初始化食物
    initCanteen() {
        this.factory.init();

        for(let i = 0; i < 100; i++){
            this.factory.add();
        }
    },

    // 加速
    speedUp() {
        this._speed = 0.24;

        this.snake.setSpeed(this._speed);
    },

    // 加速
    speedNormal() {
        this._speed = 0.12;

        this.snake.setSpeed(this._speed);
    },

    // 更新摄像机位置
    updateCameraPosition() {
        // camera跟踪蛇头 关键代码！！！
        const snakePos = this.snake.getHeadPositon();
        const cameraPos = this.checkCameraOutRange(snakePos);

        this.camera.node.position = cameraPos;
    },

    /*
     * 检查摄像机超出边界
     * @param (object) vec 向量
     */
    checkCameraOutRange(vec) {
        const _vec = this.camera.node.parent.convertToNodeSpaceAR(vec);
        const snakeMoveRange = this.snake.getMoveRange();
        const designResolution = this.getComponent(cc.Canvas).designResolution;
        const cameraMoveRangeX = Math.floor((snakeMoveRange.x - designResolution.width) / 2);
        const cameraMoveRangeY = Math.floor((snakeMoveRange.y - designResolution.height) / 2);

        if (_vec.x > cameraMoveRangeX) {
            _vec.x = cameraMoveRangeX;
        }

        if (_vec.x < -cameraMoveRangeX) {
            _vec.x = -cameraMoveRangeX;
        }

        if (_vec.y > cameraMoveRangeY) {
            _vec.y = cameraMoveRangeY;
        }

        if (_vec.y < -cameraMoveRangeY) {
            _vec.y = -cameraMoveRangeY;
        }

        return _vec;
    },

    /**
     * 回收
     * @param (string) uuid 节点uuid  
     **/
    recoverFood(uuid) {
        this.factory.recover(uuid);

        this.factory.add();
    }
});