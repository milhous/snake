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

        // 玩家数量
        this._multiplePlayers = 5;

        // 起始长度
        this._initLen = 5;
        // 最大长度
        this._maxLen = 10;

        // 蛇头
        this._head = null;
        // 蛇身
        this._bodys = [];
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
     * 移动
     * @param (number) dt 距离上一帧间隔时间
     */
    move(dt) {
        if (this._direction === null || this._speed === null) {
            return;
        }

        this._updateHeadAngle();

        this._updateHeadPosition();

        this._updateBodyPosition();
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
        const _node = null;

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
     */
    create(name = 'default', x = 0, y = 0) {
        const _head = this._getNodeFromPool(this.headPrefab, this._headPool);
        this.node.addChild(_head);

        const _bodys = [];

        for (let i = 0; i < this._initLen; i++) {
            this._addBody();
        }

        const _bodys = this._createBody();
    },

    // 创建身体
    _createBody(name) {
        const _body = cc.instantiate(this.bodyPrefab);
        this._bodys.push(_body);
        this.node.addChild(_body);


        for (let i = 0; i < this._initLen; i++) {
            this._addBody();
        }
    },

    // 增加身体
    _addBody() {
        const _body = cc.instantiate(this.bodyPrefab);
        this._bodys.push(_body);
        this.node.addChild(_body);
    },

    /*
     * 设置方向向量
     * @param (object) vec 向量
     */
    setDirectionVec(vec) {
        this._direction = vec;
    },

    /*
     * 设置速度
     * @param (number) speed 速度
     */
    setSpeed(speed) {
        this._speed = speed;
    },

    // 获取蛇头位置
    getHeadPositon() {
        const _vec = this._head.convertToWorldSpaceAR(cc.Vec2.ZERO);

        return _vec;
    },

    // 获取活动区域
    getMoveRange() {
        const _vec = cc.v2(this.node.width, this.node.height);

        return _vec;
    }
});