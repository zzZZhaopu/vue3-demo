<!--
  Pinia 使用示例组件
  演示如何在 Vue 组件中使用 Pinia Store
-->
<template>
  <div class="pinia-demo">
    <h2>Pinia 状态管理示例</h2>

    <!-- 显示用户信息 -->
    <div class="user-info">
      <p><strong>用户名:</strong> {{ userStore.userName }}</p>
      <p><strong>用户ID:</strong> {{ userStore.userId || "未登录" }}</p>
      <p>
        <strong>登录状态:</strong>
        {{ userStore.isLoggedIn ? "已登录" : "未登录" }}
      </p>
      <p><strong>显示名称:</strong> {{ userStore.userDisplayName }}</p>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button :disabled="userStore.isLoggedIn" @click="handleLogin">
        登录
      </button>
      <button :disabled="!userStore.isLoggedIn" @click="handleLogout">
        登出
      </button>
      <button :disabled="loading" @click="handleFetchUser">
        {{ loading ? "加载中..." : "获取用户信息" }}
      </button>
    </div>

    <!-- 使用说明 -->
    <div class="tips">
      <h3>💡 使用说明:</h3>
      <ol>
        <li>
          <strong>导入 Store:</strong> 使用
          <code>import { useUserStore } from '@/stores/user'</code>
        </li>
        <li>
          <strong>获取实例:</strong> 在 setup 中调用
          <code>const userStore = useUserStore()</code>
        </li>
        <li>
          <strong>访问状态:</strong> 直接通过
          <code>userStore.userName</code> 访问
        </li>
        <li>
          <strong>调用方法:</strong> 直接调用 <code>userStore.login()</code>
        </li>
        <li><strong>响应式:</strong> 所有状态都是响应式的,自动更新视图</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// 1️⃣ 导入 Store
import { useUserStore } from "@/stores/user";

// 2️⃣ 获取 Store 实例(在 setup 中调用)
const userStore = useUserStore();

// 本地状态(加载中标识)
const loading = ref(false);

// 3️⃣ 调用 Store 的方法
/**
 * 处理登录
 */
const handleLogin = () => {
  userStore.login("李四", 10002);
};

/**
 * 处理登出
 */
const handleLogout = () => {
  userStore.logout();
};

/**
 * 处理异步获取用户信息
 */
const handleFetchUser = async () => {
  loading.value = true;
  try {
    await userStore.fetchUserInfo();
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.pinia-demo {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

h2 {
  color: #42b883;
  margin-bottom: 20px;
}

.user-info {
  background: white;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.user-info p {
  margin: 8px 0;
  font-size: 14px;
}

.actions {
  margin-bottom: 20px;
}

.actions button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #42b883;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.actions button:hover:not(:disabled) {
  background: #35a372;
}

.actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.tips {
  background: #fff3cd;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
}

.tips h3 {
  margin-top: 0;
  color: #856404;
}

.tips ol {
  margin: 10px 0;
  padding-left: 20px;
}

.tips li {
  margin: 8px 0;
  line-height: 1.6;
}

.tips code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  font-size: 13px;
  color: #e83e8c;
}
</style>
