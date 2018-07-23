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

        // 用户ID
        this._userId = 'default';
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
        factory: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 食品工厂'
        },
        snakeManager: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 蛇'
        },
        camera: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 摄像机'
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

        this.factory.init();

        this.snakeManager.init();

        this.snakeManager.create({
            name: this._userId,
            x: 0,
            y: 0,
            speed: SPEED.NORMAL,
            direction: cc.v2(100 * cc.randomMinus1To1(), 100 * cc.randomMinus1To1())
        });
    },

    update(dt) {
        mediator.update(dt);

        this.snakeManager.updateState(dt);
    },

    lateUpdate(dt) {
        this._updateCameraPosition();
    },

    // 初始化组件
    _initComponent() {
        // 食品工厂
        this.factory = this.factory.getComponent('Factory');

        // 蛇
        this.snakeManager = this.snakeManager.getComponent('SnakeManager');

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
                this.snakeManager.setSnakeDirection(props.vec, this._userId);
            }
        });

        // SYSTEM - 回收食物
        mediator.add({
            scene: SCENES.GAME,
            action: SYS_OPEARTION.RECOVER_FOOD,
            callback: (props) => {
                this._recoverFood(props.uuid);
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

    /*
     * 设置速度
     * @param (number) speed 速度
     * @param (string) name 名称
     */
    setSnakeSpeed(speed, name = 'default') {
        this.snakeManager.setSpeed(speed, name);
    },

    /*
     * 设置移动向量
     * @param (object) vec 向量
     * @param (string) name 名称
     */
    setSnakeDirection(vec, name = 'default') {
        this.snakeManager.setDirection(vec, name);
    },

    // 加速
    _speedUp() {
        this.snakeManager.setSpeed(SPEED.UP, this._userId);
    },

    // 加速
    _speedNormal() {
        this.snakeManager.setSpeed(SPEED.NORMAL, this._userId);
    },

    /*
     * 回收
     * @param (string) uuid 节点uuid  
     */
    _recoverFood(uuid) {
        this.factory.recover(uuid);

        this.factory.add();
    },

    // 更新摄像机位置
    _updateCameraPosition() {
        // camera跟踪蛇头 关键代码！！！
        const snakePos = this.snakeManager.getHeadPositonByName(this._userId);
        const cameraPos = this._checkCameraOutRange(snakePos);

        this.camera.position = cameraPos;
    },

    /*
     * 检查摄像机超出边界
     * @param (object) vec 向量
     */
    _checkCameraOutRange(vec) {
        const _vec = this.camera.parent.convertToNodeSpaceAR(vec);
        const snakeMoveRange = this.snakeManager.getMoveRange();
        const visibleSize = cc.director.getVisibleSize();
        const cameraMoveRangeX = Math.floor((snakeMoveRange.x - visibleSize.width) / 2);
        const cameraMoveRangeY = Math.floor((snakeMoveRange.y - visibleSize.height) / 2);

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
    }
});