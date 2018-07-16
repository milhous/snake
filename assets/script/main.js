cc.Class({
    extends: cc.Component,

    ctor() {

    },

    properties: {
        controler: {
            default: null,
            type: cc.Node,
            tooltip: '组件 - 方向控制器'
        },
        btnSpeed: {
            default: null,
            type: cc.Node,
            tooltip: '按钮 - 加速'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 显示FPS信息
        cc.director.setDisplayStats(false);

        this.initComponent();

        this.initEvent();
    },

    start () {

    },

    // 初始化组件
    initComponent() {
        this.controler = this.controler.getComponent('Controler');
    },

    // 初始化事件
    initEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.controler.move, this.controler);
        this.node.on(cc.Node.EventType.TOUCH_END, this.controler.end, this.controler);
    }

    // update (dt) {},
});
