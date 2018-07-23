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
	SNAKE_AVOID: 'sys:snakeAvoid', // 回避
    UPDATE_DIRECTION: 'sys::updateDirection', // 更新方向
    RECOVER_FOOD: 'sys:recoverFood' // 回收资源
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