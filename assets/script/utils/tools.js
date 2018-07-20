// 获取随机数
export function getRandom(n, m) {
    return Math.round(Math.random() * (m - n) + n);
};