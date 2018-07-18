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
        },
        foodSkin: {
            default: [],
            type: [cc.SpriteFrame],
            tooltip: 'SpriteFrame - 食物皮肤'
        },
    },

    onLoad() {

    },

    start() {

    },

    // 初始化
    init() {
        // 创建麻将对象池
        this._createPool();
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

    // 创建食物
    _create() {
        let _food = null;

        if (this._pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            _food = this._pool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，用 cc.instantiate 重新创建
            _food = cc.instantiate(this.foodPrefab);
        }

        return _food;
    },

    // 增加食物
    add() {
        const _x = cc.randomMinus1To1() * this.node.width / 2;
        const _y = cc.randomMinus1To1() * this.node.height / 2;
        const _index = this._getRandom(0, this.foodSkin.length);

        const _food = this._create();
        const _sp = _food.getComponent(cc.Sprite);
        _sp.spriteFrame = this.foodSkin[_index];

        _food.parent = this.node;
        _food.x = _x;
        _food.y = _y;
    },

    // 获取随机数
    _getRandom(n, m) {
        return Math.round(Math.random() * (m - n) + n);
    }
});