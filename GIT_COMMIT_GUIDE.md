# Git 提交规范

本项目使用 Husky + Commitlint + Lint-staged 来规范代码提交流程。

---

## 🚀 Husky 完整安装流程

### 1. 安装依赖包

```bash
# 安装 Husky
npm install husky --save-dev

# 安装 Commitlint 相关包
npm install @commitlint/cli @commitlint/config-conventional --save-dev

# 安装 Lint-staged（用于暂存区文件检查）
npm install lint-staged --save-dev
```

### 2. 初始化 Husky

```bash
# 初始化 Husky（会创建 .husky 目录并配置 Git hooks 路径）
npm run prepare
```

**或者在 package.json 中添加 prepare 脚本后再执行：**

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

### 3. 创建 Git Hooks

#### 创建 pre-commit Hook（提交前检查）

在 `.husky/pre-commit` 文件中添加：

```bash
# Husky pre-commit hook
# 
# 作用：在 git commit 之前自动执行代码检查
# 只检查暂存区（staged）的文件，不会检查所有文件

npx lint-staged
```

#### 创建 commit-msg Hook（提交信息检查）

在 `.husky/commit-msg` 文件中添加：

```bash
# Husky commit-msg hook
# 
# 作用：在 git commit 之后、提交信息保存之前，检查提交信息格式
# 确保提交信息符合 commitlint 配置的规范

npx --no -- commitlint --edit $1
```

### 4. 配置 Commitlint

创建 `commitlint.config.cjs` 文件：

```javascript
module.exports = {
  // 继承常规配置（Angular 提交规范）
  extends: ['@commitlint/config-conventional'],
  
  // 自定义规则
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',      // 新功能
        'fix',       // 修复 bug
        'docs',      // 文档变更
        'style',     // 代码格式
        'refactor',  // 重构
        'perf',      // 性能优化
        'test',      // 增加测试
        'chore',     // 构建过程或辅助工具的变动
        'revert',    // 回滚
        'build',     // 构建系统或外部依赖项的更改
        'ci',        // CI/CD 配置更改
      ],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
};
```

### 5. 配置 Lint-staged

在 `package.json` 中添加：

```json
{
  "lint-staged": {
    "*.{ts,tsx,vue}": [
      "vue-tsc --noEmit"
    ],
    "*.{css,scss,vue}": [
      "stylelint --fix"
    ]
  }
}
```

### 6. 验证安装

#### 检查 Git hooks 路径配置

```bash
# 查看 hooks 路径（应该显示 .husky/_）
git config core.hooksPath
```

#### 测试提交信息检查

```bash
# 测试不规范的提交信息（应该被拒绝）
echo "test" > test.txt
git add test.txt
git commit -m "test message"

# 应该看到类似错误：
# ✖   subject may not be empty [subject-empty]
# ✖   type may not be empty [type-empty]
```

#### 测试正确的提交

```bash
# 使用规范的提交信息（应该成功）
git commit -m "chore: 测试提交"
```

### 7. 目录结构

安装完成后，项目结构如下：

```
项目根目录/
├── .husky/
│   ├── _/                    # Husky 生成的内部文件
│   │   ├── .gitignore
│   │   ├── husky.sh
│   │   ├── commit-msg       # Git 实际调用的 hook
│   │   └── pre-commit       # Git 实际调用的 hook
│   ├── commit-msg           # 你配置的 commit-msg 脚本
│   └── pre-commit           # 你配置的 pre-commit 脚本
├── .git/
│   └── config               # 包含 core.hooksPath = .husky/_
├── commitlint.config.cjs    # Commitlint 配置
└── package.json             # 包含 lint-staged 配置
```

### 8. 常见问题排查

#### 问题 1：Hooks 不生效

```bash
# 检查 hooks 路径是否正确配置
git config core.hooksPath

# 如果为空或错误，重新初始化
npm run prepare
```

#### 问题 2：权限问题

```bash
# 确保 hook 文件有执行权限
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

#### 问题 3：团队成员克隆项目后 Hooks 不工作

团队成员克隆项目后需要执行：

```bash
# 安装依赖（会自动执行 prepare 脚本）
npm install

# 或手动初始化
npm run prepare
```

### 9. 完整的 package.json 配置示例

```json
{
  "name": "vue3-demo",
  "scripts": {
    "prepare": "husky",
    "lint:script": "vue-tsc --noEmit",
    "lint:style": "stylelint \"src/**/*.{css,scss,vue}\" --fix"
  },
  "devDependencies": {
    "@commitlint/cli": "^20.3.0",
    "@commitlint/config-conventional": "^20.3.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7"
  },
  "lint-staged": {
    "*.{ts,tsx,vue}": [
      "vue-tsc --noEmit"
    ],
    "*.{css,scss,vue}": [
      "stylelint --fix"
    ]
  }
}
```

---

## 📝 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 示例

```bash
# 简单提交
feat(user): 添加用户登录功能

# 完整提交
feat(user): 添加用户登录功能

实现了用户名密码登录和记住密码功能

Closes #123
```

---

## 🏷️ Type 类型说明

| Type | 说明 | 示例 |
|------|------|------|
| **feat** | 新功能 | `feat(user): 添加用户注册功能` |
| **fix** | 修复 bug | `fix(login): 修复登录失败的问题` |
| **docs** | 文档变更 | `docs(readme): 更新安装说明` |
| **style** | 代码格式（不影响功能） | `style(home): 调整首页布局` |
| **refactor** | 重构（既不是新功能也不是修复） | `refactor(api): 优化接口请求逻辑` |
| **perf** | 性能优化 | `perf(list): 优化列表渲染性能` |
| **test** | 增加测试 | `test(user): 添加用户模块单元测试` |
| **chore** | 构建过程或辅助工具的变动 | `chore(deps): 升级依赖包版本` |
| **revert** | 回滚 | `revert: 回滚到 v1.0.0` |
| **build** | 构建系统或依赖项的更改 | `build(vite): 优化打包配置` |
| **ci** | CI/CD 配置更改 | `ci(github): 添加自动部署流程` |

---

## 🎯 Scope 范围（可选）

范围用于说明提交影响的范围，比如：

- `user` - 用户模块
- `order` - 订单模块
- `api` - 接口相关
- `deps` - 依赖相关
- `config` - 配置相关

---

## ✅ 提交流程

### 1. 暂存文件
```bash
git add .
```

### 2. 提交代码
```bash
git commit -m "feat(user): 添加用户登录功能"
```

### 3. 自动检查
提交时会自动执行：

**Pre-commit Hook（提交前）：**
- ✅ TypeScript 类型检查
- ✅ Stylelint 样式检查和自动修复

**Commit-msg Hook（提交信息检查）：**
- ✅ 检查提交信息格式是否符合规范

---

## ❌ 常见错误

### 错误 1：提交信息格式不正确

```bash
# ❌ 错误示例
git commit -m "添加登录功能"
git commit -m "fix bug"
git commit -m "update"

# ✅ 正确示例
git commit -m "feat(user): 添加登录功能"
git commit -m "fix(login): 修复登录失败的问题"
git commit -m "docs(readme): 更新文档"
```

**错误提示：**
```
⧗   input: 添加登录功能
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

### 错误 2：类型拼写错误

```bash
# ❌ 错误
git commit -m "feature(user): 添加登录功能"

# ✅ 正确
git commit -m "feat(user): 添加登录功能"
```

### 错误 3：代码检查未通过

如果代码有 TypeScript 错误或样式问题，提交会被阻止。

**解决方法：**
1. 修复代码错误
2. 重新提交

---

## 🔧 跳过检查（不推荐）

在紧急情况下，可以跳过 Hooks 检查：

```bash
# 跳过所有 Hooks
git commit --no-verify -m "feat(user): 添加登录功能"

# 或使用简写
git commit -n -m "feat(user): 添加登录功能"
```

**⚠️ 注意：** 非必要情况不要跳过检查，这会降低代码质量！

---

## 💡 最佳实践

### 1. 提交信息要清晰
```bash
# ❌ 不好
git commit -m "fix: 修复问题"

# ✅ 好
git commit -m "fix(login): 修复用户名为空时登录崩溃的问题"
```

### 2. 提交要原子化
- 每次提交只做一件事
- 避免一次提交包含多个不相关的改动

### 3. 善用 Scope
```bash
feat(user): 添加用户登录功能
feat(order): 添加订单列表页面
fix(api): 修复接口超时问题
```

### 4. 及时提交
- 完成一个功能点就提交
- 不要积累太多改动再提交

---

## 🛠️ 手动检查命令

如果想在提交前手动检查代码：

```bash
# TypeScript 类型检查
npm run lint:script

# 样式检查
npm run lint:style
```

---

## 📚 相关配置文件

- `.husky/pre-commit` - 提交前检查脚本
- `.husky/commit-msg` - 提交信息检查脚本
- `commitlint.config.cjs` - Commitlint 配置
- `package.json` - lint-staged 配置

---

## 🤝 团队协作

所有团队成员都应该：
1. ✅ 遵守提交信息规范
2. ✅ 确保代码检查通过再提交
3. ✅ 不要随意跳过 Hooks 检查
4. ✅ 保持提交信息清晰明了

---

## ❓ 常见问题

### Q: 为什么需要这些规范？
A: 规范的提交信息和代码质量检查可以：
- 方便团队成员理解代码变更
- 自动生成更新日志（CHANGELOG）
- 快速定位问题和回滚
- 保证代码质量

### Q: Husky 检查会影响提交速度吗？
A: 只检查暂存区的文件，速度很快，一般在几秒内完成。

### Q: 如何禁用 Husky？
A: 不推荐禁用。如果必须禁用：
```bash
# 临时禁用
HUSKY=0 git commit -m "message"

# 永久禁用（不推荐）
npm uninstall husky
```
