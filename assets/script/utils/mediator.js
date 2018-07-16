// wroker
import worker from '../utils/worker.js';

// 数据组件连接
class Mediator {
    constructor() {
        // 数据
        this._data = {};
        // 监听列表
        this._list = [];
        // 执行栈
        this._todoStack = [];
    }

    /*
     * 新增组件和数据连接
     * @param (string) scene 场景 *
     * @param (string) action 动作 *
     * @param (function) callback 回调函数 *
     */
    add({
        scene,
        action,
        callback
    }) {
        const _result = this._list.filter((obj) => {
            return obj.scene === scene && obj.action === action;
        });

        if (_result.length > 0) {
            return;
        }

        this._list.push({
            scene,
            action,
            callback
        });
    }

    // 更新状态
    update() {
        if (this._todoStack.length > 0) {
            const _data = this._popTodoStack();

            this._dispatch(_data);
        }
    }

    // 清理监听和数据
    clear() {
        this._list = [];
    }

    /*
     * 根据名称清理监听和数据
     * @param (string) name 场景名称
     */
    clearByScene(name) {
        this._list = this._list.filter((obj, index) => {
            return obj.scene !== name;
        });
    }

    /*
     * 推送数据到todo栈中
     * @param (string) action 命令
     * @param (object) data 数据
     */
    _pushTodoStack(action, data) {
        this._todoStack.push({
            type: action,
            payload: data
        });
    }

    // 获取todo栈中数据
    _popTodoStack() {
        let _data = null;

        if (this._todoStack.length > 0) {
            _data = this._todoStack.shift()
        }

        return _data;
    }

    /*
     * 数据分发
     * @param (object) data 数据
     */
    _dispatch(data) {
        // 数据行为在监听列表中，分派数据
        const _result = this._check(data.type);

        if (_result.length === 0) {
            return;
        }

        _result[0].callback(data.payload);
    }

    /*
     * 检查action是否在list中
     * @param (string) action
     */
    _check(action) {
        const _result = this._list.filter((obj) => {
            return obj.action === action;
        });

        return _result;
    }

    // 获取监听列表
    getList() {
        return this._list;
    }

    // 存储数据
    setData(key, value) {
        this._data[key] = value;
    }

    // 获取数据
    getData(key) {
        return this._data[key];
    }

    // 初始化
    init() {
        worker.onmessage = (message) => {
            const _data = message.data;

            this._pushTodoStack(_data.cmd, _data.data);

            this.setData(_data.cmd, _data.data);

            console.log('worker', JSON.stringify(_data));
        };
    }
}

const mediator = new Mediator();

export default mediator;