cc.Class({
    extends: cc.Component,

    ctor() {
        // 对象池
        this._pool = null;
        // 初始数量
        this._initCount = 100;
    },

    properties: {
        foodPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: '预制资源 - 食物'
        }
    },

    onLoad() {

    },

    start() {

    },

    // 初始化
    init() {
        // 创建麻将对象池
        this._createPool();

        // 创建食物
        for (let i = 0; i < 100; i++) {
            this.add();
        }
    },

    // 创建对象池
    _createPool() {
        this._pool = new cc.NodePool();

        for (let i = 0; i < this._initCount; ++i) {
            // 创建节点
            const _food = cc.instantiate(this.foodPrefab);
            // 通过 putInPool 接口放入对象池
            this._pool.put(_food);
        }
    },

    // 增加食物
    add(x, y) {
        const _x = typeof x === 'number' ? x : cc.randomMinus1To1() * this.node.width / 2;
        const _y = typeof y === 'number' ? y : cc.randomMinus1To1() * this.node.height / 2;

        const _food = this._getNodeFromPool();
        _food.x = _x;
        _food.y = _y;
        this.node.addChild(_food);

        const foodComp = _food.getComponent('Food');
        foodComp.updateSkin();
        foodComp.openCollision();
    },

    /**
     * 回收
     * @param (string) uuid 节点uuid  
     **/
    recover(uuid) {
        const _node = this.node.getChildByUuid(uuid);

        // 移除指定对象上的所有动作
        _node.stopAllActions();

        // 放回对象池
        this._pool.put(_node);
    },

    // 从对象池中获取节点
    _getNodeFromPool() {
        let _node = null;

        if (this._pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            _node = this._pool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，用 cc.instantiate 重新创建
            _node = cc.instantiate(this.foodPrefab);
        }

        return _node;
    },
});