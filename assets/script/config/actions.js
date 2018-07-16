/*
 * 用户行为
 */

const USER_BEHAVIOR = {
    LOAD_SCENE: 'load_scene', // 加载场景
    CREATE_ROOM: 'create_room', // 创建房间
};

/*
 * 系统操作
 */
const SYS_OPEARTION = {
    UPDATE_DIRECTION: 'sys::updateDirection'
};

/*
 * 服务端命令
 */
const SERVER_CMD = {
    SYSTEM_ERROR: 'conn::error' // 故障提示
};

export {
    USER_BEHAVIOR,
    SYS_OPEARTION,
    SERVER_CMD
}