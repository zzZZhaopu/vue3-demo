import js from '@eslint/js'                    // ESLint 官方推荐的 JavaScript 规则
import pluginVue from 'eslint-plugin-vue'      // Vue 3 专用的检查规则
import tseslint from 'typescript-eslint'       // TypeScript 专用的检查规则
import globals from 'globals'                  // 全局变量定义（如 window、document 等）
import vueParser from 'vue-eslint-parser'      // Vue 文件解析器

export default [
  // ==================== 基础配置 ====================
  
  /**
   * 1. 定义要检查的文件范围
   * 
   * files: 告诉 ESLint 要检查哪些文件
   * - *.js: 所有 JS 文件
   * - *.ts: 所有 TypeScript 文件
   * - *.vue: 所有 Vue 组件文件
   */
  {
    files: ['**/*.{js,ts,vue}'],
  },
  
  /**
   * 2. 定义要忽略的文件（不检查）
   * 
   * 这些文件通常是：
   * - 构建输出目录（dist）
   * - 依赖包目录（node_modules）
   * - 自动生成的文件
   */
  {
    ignores: [
      '**/dist/**',           // 打包输出目录
      '**/node_modules/**',   // npm 安装的依赖包
      '**/*.d.ts',            // TypeScript 类型声明文件（自动生成的）
      '**/auto-imports.d.ts', // unplugin-auto-import 生成的
      '**/components.d.ts',   // unplugin-vue-components 生成的
    ],
  },
  
  // ==================== JavaScript 规则 ====================
  
  /**
   * 3. 应用 ESLint 官方推荐的规则
   * 
   * 这包含了最基本的 JavaScript 代码规范：
   * - 禁止未使用的变量
   * - 禁止重复的条件判断
   * - 要求使用 === 而不是 ==
   * 等等...
   */
  js.configs.recommended,
  
  // ==================== Vue 规则 ====================
  
  /**
   * 4. 应用 Vue 3 推荐的规则
   * 
   * 这包含了 Vue 组件的最佳实践：
   * - 组件名必须是多个单词
   * - Props 必须定义类型
   * - v-for 必须有 :key
   * 等等...
   */
  ...pluginVue.configs['flat/recommended'],
  
  // ==================== TypeScript 规则 ====================
  
  /**
   * 5. 应用 TypeScript 推荐的规则
   * 
   * 这包含了 TypeScript 的类型安全检查：
   * - 禁止使用 any 类型（可配置）
   * - 要求函数有返回值类型
   * - 检查类型推断
   * 等等...
   */
  ...tseslint.configs.recommended,
  
  // ==================== Vue 文件中的 TypeScript 配置 ====================
  
  /**
   * 6. 配置 Vue 文件中的 <script> 标签
   * 
   * 告诉 ESLint：
   * - Vue 文件中的 <script> 部分使用 TypeScript 解析
   * - 这样才能正确检查 Vue 组件中的 TS 代码
   */
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,                        // 使用 Vue 专用解析器
      parserOptions: {
        parser: tseslint.parser,                // <script> 标签内容使用 TS 解析器
        ecmaVersion: 'latest',                  // 支持最新的 ECMAScript 特性
        sourceType: 'module',                   // 使用 ES 模块
      },
    },
  },
  
  // ==================== 全局变量配置 ====================
  
  /**
   * 7. 定义全局变量
   * 
   * 告诉 ESLint 哪些全局变量是合法的：
   * - browser: window、document、console 等浏览器 API
   * - node: process、__dirname 等 Node.js API
   * - es2021: Promise、Map、Set 等现代 JS API
   */
  {
    languageOptions: {
      globals: {
        ...globals.browser,  // 浏览器环境
        ...globals.node,     // Node.js 环境（Vite 配置文件需要）
        ...globals.es2021,   // ES2021 语法支持
      },
    },
  },
  
  // ==================== 自定义规则配置 ====================
  
  /**
   * 8. 自定义规则（根据项目需求调整）
   * 
   * 规则级别：
   * - 'off' 或 0: 关闭规则
   * - 'warn' 或 1: 警告（不会阻止代码运行）
   * - 'error' 或 2: 错误（会阻止代码提交，如果配置了 Git Hook）
   */
  {
    rules: {
      // ===== Vue 相关规则 =====
      
      /**
       * 组件名称规则
       * 允许单个单词的组件名（如 App、Login）
       * 默认要求多个单词，但有些情况下单词就够了
       */
      'vue/multi-word-component-names': 'off',
      
      /**
       * 自闭合标签规则
       * 要求 HTML 标签在没有内容时使用自闭合
       * 例如：<img /> 而不是 <img>
       */
      'vue/html-self-closing': ['warn', {
        html: {
          void: 'always',      // <img /> 正确
          normal: 'always',    // <div /> 正确
          component: 'always', // <MyComponent /> 正确
        },
      }],
      
      /**
       * 最大属性数量（单行）
       * 与 Prettier 冲突，已关闭，让 Prettier 处理格式
       */
      'vue/max-attributes-per-line': 'off',
      
      /**
       * HTML 元素内容换行规则
       * 与 Prettier 冲突，关闭
       * 例如：<el-button>按钮</el-button> 是否需要换行
       */
      'vue/singleline-html-element-content-newline': 'off',
      
      /**
       * 多行 HTML 元素内容换行规则
       * 与 Prettier 冲突，关闭
       */
      'vue/multiline-html-element-content-newline': 'off',
      
      /**
       * HTML 缩进规则
       * 与 Prettier 冲突，关闭
       */
      'vue/html-indent': 'off',
      
      /**
       * 属性顺序规则
       * 如果你不想强制属性顺序，可以关闭
       * 例如：@click 和 :disabled 的顺序
       */
      'vue/attributes-order': 'warn',
      
      // ===== TypeScript 相关规则 =====
      
      /**
       * 允许使用 any 类型
       * any 类型会失去类型检查，但有时确实需要
       * 建议：尽量少用，只在必要时使用
       */
      '@typescript-eslint/no-explicit-any': 'warn',
      
      /**
       * 允许未使用的变量（如果以 _ 开头）
       * 例如：const _unusedVar = 123
       * 这在某些情况下很有用（占位参数等）
       */
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',        // 参数以 _ 开头时忽略
        varsIgnorePattern: '^_',        // 变量以 _ 开头时忽略
      }],
      
      /**
       * 允许空函数
       * 有时我们需要空的回调函数
       */
      '@typescript-eslint/no-empty-function': 'warn',
      
      /**
       * 允许使用 require()
       * 虽然推荐使用 import，但某些配置文件需要 require
       */
      '@typescript-eslint/no-require-imports': 'off',
      
      // ===== JavaScript 基础规则 =====
      
      /**
       * 禁止使用 console
       * 生产环境不应该有 console.log
       * 但这里设为警告，方便开发调试
       */
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      
      /**
       * 禁止使用 debugger
       * debugger 只能在开发时使用
       */
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      
      /**
       * 要求使用 const 或 let
       * 禁止使用 var（var 有很多坑）
       */
      'no-var': 'error',
      
      /**
       * 优先使用 const
       * 如果变量不会被重新赋值，使用 const
       */
      'prefer-const': 'warn',
      
      /**
       * 要求使用模板字符串
       * 推荐：`Hello ${name}` 而不是 'Hello ' + name
       */
      'prefer-template': 'warn',
    },
  },
]
