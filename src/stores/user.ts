/**
 * 用户信息 Store 示例
 * 这是一个使用 Pinia 管理用户状态的例子
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * defineStore 的两种写法:
 * 1. Options API 风格 (类似 Vuex)
 * 2. Composition API 风格 (推荐,更灵活)
 * 
 * 这里使用 Composition API 风格
 */
export const useUserStore = defineStore('user', () => {
  // ===== 状态 (State) =====
  // 相当于 data,使用 ref 定义
  const userName = ref<string>('游客')
  const userId = ref<number | null>(null)
  const isLoggedIn = ref<boolean>(false)

  // ===== 计算属性 (Getters) =====
  // 相当于 computed,自动缓存
  const userDisplayName = computed(() => {
    return isLoggedIn.value ? `欢迎, ${userName.value}` : '请登录'
  })

  // ===== 方法 (Actions) =====
  // 相当于 methods,可以是异步的
  
  /**
   * 登录方法
   * @param name 用户名
   * @param id 用户ID
   */
  function login(name: string, id: number) {
    userName.value = name
    userId.value = id
    isLoggedIn.value = true
    console.log('用户已登录:', name)
  }

  /**
   * 登出方法
   */
  function logout() {
    userName.value = '游客'
    userId.value = null
    isLoggedIn.value = false
    console.log('用户已登出')
  }

  /**
   * 模拟异步获取用户信息
   */
  async function fetchUserInfo() {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟返回的数据
    login('张三', 10001)
  }

  // ===== 导出 =====
  // 必须 return 所有需要外部访问的内容
  return {
    // 状态
    userName,
    userId,
    isLoggedIn,
    // 计算属性
    userDisplayName,
    // 方法
    login,
    logout,
    fetchUserInfo
  }
})
