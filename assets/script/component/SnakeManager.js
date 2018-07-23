import {
    getRandom
} from 'tools';

// 蛇
import Snake from 'Snake';

cc.Class({
    extends: cc.Component,

    ctor() {
        // 头部对象池
        this._headPool = null;
        // 身体对象池
        this._bodyPool = null;

        // 起始长度
        this._initLen = 5;
        // 最大长度
        this._maxLen = 10;

        this._snakes = {};
    },

    properties: {
        headPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: '预制资源 - 蛇头'
        },
        bodyPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: '预制资源 - 蛇身'
        }
    },

    onLoad() {
        this.init();
    },

    start() {

    },

    // 初始化
    init() {
        this._headPool = this._createPool(this.headPrefab, 10);
        this._bodyPool = this._createPool(this.bodyPrefab, 200);
    },

    /* 
     * 更新状态
     * @param (number) dt 距离上一帧间隔时间
     */
    updateState(dt) {
        Object.keys(this._snakes).map((key) => {
            this._snakes[key].move(dt);
        });
    },

    /*
     * 创建对象池
     * @param (object) prefab 预制资源
     * @param (number) num 数量
     */
    _createPool(prefab, num) {
        const _pool = new cc.NodePool();

        for (let i = 0; i < num; ++i) {
            // 创建节点
            const _node = cc.instantiate(prefab);
            // 通过 putInPool 接口放入对象池
            _pool.put(_node);
        }

        return _pool;
    },

    /*
     * 从对象池中获取节点
     * @param (object) prefab 预制资源
     * @param (object) pool 对象池
     */
    _getNodeFromPool(prefab, pool) {
        let _node = null;

        if (_pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            _node = _pool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，用 cc.instantiate 重新创建
            _node = cc.instantiate(prefab);
        }

        return _node;
    },

    /*
     * 创建
     * @param (string) name 名称
     * @param (number) x X轴位置
     * @param (number) y Y轴位置
     * @param (number) speed 速度
     * @param (object) direction 方向向量
     */
    create({
        name = 'default',
        x = 0,
        y = 0,
        speed,
        direction
    }) {
        const _arr = [];

        const _head = this._getNodeFromPool(this.headPrefab, this._headPool);
        this.node.addChild(_head);

        _arr.push(_head);

        for (let i = 0; i < this._initLen; i++) {
            const _body = this._getNodeFromPool(this.bodyPrefab, this._bodyPool);
            body.isMove = false;
            this.node.addChild(_body);

            _arr.push(_body);
        }

        const _snake = new Snake();
        _snake.init({
            snake: _arr,
            initX: x,
            initY: y,
            rangeX: this.node.width/2,
            rangeY: this.node.height/2,
            speed: speed,
            direction: direction
        });

        this._snakes[name] = _snake;
    },

    /*
     * 设置方向向量
     * @param (object) vec 向量
     * @param (string) name 名称
     */
    setDirection(vec, name = 'default') {
        const _snake = this.getSnakeByName(name);

        if (_snake === null) {
            return;
        }

        _snake.setDirection(vec);
    },

    /*
     * 设置速度
     * @param (number) speed 速度
     * @param (string) name 名字
     */
    setSpeed(speed, name = 'default') {
        const _snake = this.getSnakeByName(name);

        if (_snake === null) {
            return;
        }

        _snake.setSpeed(speed);
    },

    /*
     * 获取蛇头位置
     * @param (string) name 名字
     */
    getHeadPositonByName(name = 'default') {
        const _snake = this.getSnakeByName(name);

        if (_snake === null) {
            return;
        }

        const _vec = _snake.getHeadPositon();

        return _vec;
    },

    /*
     * 通过名称获取实例
     * @param (string) name 名字
     */
    getSnakeByName(name = 'default') {
        let _snake = null;

        if (typeof this._snakes[name] !== 'undefined') {
            _snake = this._snakes[name];
        }

        return _snake;
    },

    // 获取活动区域
    getMoveRange() {
        const _vec = cc.v2(this.node.width, this.node.height);

        return _vec;
    }
});