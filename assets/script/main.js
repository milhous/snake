import mediator from 'mediator';
import { SCENES } from 'global';
import { SYS_OPEARTION } from 'actions';

cc.Class({
    extends: cc.Component,

    ctor() {
        // 加速度
        this._speed = 0.12;
    },

    properties: {
        btnSpeed: {
            default: null,
            type: cc.Node,
            tooltip: '按钮 - 加速'
        },
        canteen: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 食堂'
        },
        snake: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 蛇'
        },
        controler: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 方向控制器'
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
        // camera跟踪蛇头 关键代码！！！
        const targetPos = this.snake.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.camera.node.position = this.camera.node.parent.convertToNodeSpaceAR(targetPos);
    },

    // 初始化组件
    initComponent() {
        // 食堂
        this.canteen = this.canteen.getComponent('Canteen');
        this.initCanteen();

        // 蛇
        this.snake = this.snake.getComponent('Snake');
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
            y: this.node.height / 2,
            camera: this.camera
        });

        this.snake.setDirectionVec(cc.v2(100 * cc.randomMinus1To1(), 100 * cc.randomMinus1To1()));

        this.snake.setSpeed(this._speed);
    },

    // 初始化食物
    initCanteen() {
        this.canteen.init();

        for(let i = 0; i < 100; i++){
            this.canteen.add();
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
    }
});