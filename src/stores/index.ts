/**
 * Pinia Store 入口文件
 * 这个文件用来创建和导出 Pinia 实例
 */
import { createPinia } from 'pinia'

// 创建 Pinia 实例(状态管理的"仓库管理员")
const pinia = createPinia()

// 导出 Pinia 实例,供 main.ts 使用
export default pinia
