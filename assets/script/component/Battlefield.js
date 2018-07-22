cc.Class({
    extends: cc.Component,

    ctor() {
        this._mySnake = null;
        this._snakes = {};
    },

    properties: {
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
        this._initComponent();

        this._initFactory();

        this._initSnake();
    },

    start() {},

    // 初始化组件
    _initComponent() {
        // 食品工厂
        this.factory = this.factory.getComponent('Factory');

        // 蛇
        this.snakeManager = this.snakeManager.getComponent('SnakeManager');
    },

    // 初始蛇
    _initSnake() {
        const _snake = cc.instantiate(this.snakePrefab);
        this.node.addChild(_snake);

        const snakeComp = _snake.getComponent('Snake');
        snakeComp.setDirectionVec(cc.v2(100 * cc.randomMinus1To1(), 100 * cc.randomMinus1To1()));

        this._snakes['own'] = snakeComp;
        this._mySnake = snakeComp;
    },

    // 初始化食物
    _initFactory() {
        this.factory.init();

        for (let i = 0; i < 100; i++) {
            this.factory.add();
        }
    },

    /*
     * 更新状态
     * @param (number) dt 距离上一帧间隔时间
     */
    updateState(dt) {
        this._updateSnakeMove(dt);
    },

    /*
     * 设置速度
     * @param (number) speed 速度
     * @param (string) name 名称
     */
    setSnakeSpeed(speed) {
        this._snakes['own'].setSpeed(speed);
    },

    /*
     * 设置移动向量
     * @param (object) vec 向量
     * @param (string) name 名称
     */
    setSnakeDirectionVec(vec) {
        this._snakes['own'].setDirectionVec(vec);
    },

    /*
     * 更新移动
     * @param (number) dt 距离上一帧间隔时间
     */
    _updateSnakeMove(dt) {
        Object.keys(this._snakes).map((key) => {
            this._snakes[key].move(dt);
        });
    },

    /*
     * 回收
     * @param (string) uuid 节点uuid  
     */
    recoverFood(uuid) {
        this.factory.recover(uuid);

        this.factory.add();
    },

    // 更新摄像机位置
    updateCameraPosition() {
        // camera跟踪蛇头 关键代码！！！
        const snakePos = this._snakes['own'].getHeadPositon();
        const cameraPos = this._checkCameraOutRange(snakePos);

        this.camera.position = cameraPos;
    },

    /*
     * 检查摄像机超出边界
     * @param (object) vec 向量
     */
    _checkCameraOutRange(vec) {
        const _vec = this.camera.parent.convertToNodeSpaceAR(vec);
        const snakeMoveRange = this._snakes['own'].getMoveRange();
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