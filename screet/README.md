# 系统截图工具

这个工具用于自动截取整个系统的各个页面，并将截图保存到 `docs` 目录。

## 使用方法

### 1. 安装依赖

```bash
cd screet
npm install
```

### 2. 启动前端服务

确保前端服务正在运行：

```bash
cd ../food-sharing-frontend
npm run dev
```

前端服务默认运行在 `http://localhost:5175`

### 3. 运行截图脚本

```bash
cd screet
npm run screenshot
```

或者直接运行：

```bash
node screenshot.js
```

### 4. 使用自定义登录凭据（可选）

如果需要截图需要登录的页面，可以设置环境变量：

**Windows (CMD):**
```cmd
set SCREENSHOT_USERNAME=your_username
set SCREENSHOT_PASSWORD=your_password
npm run screenshot
```

**Windows (PowerShell):**
```powershell
$env:SCREENSHOT_USERNAME="your_username"
$env:SCREENSHOT_PASSWORD="your_password"
npm run screenshot
```

**Linux/Mac:**
```bash
SCREENSHOT_USERNAME=your_username SCREENSHOT_PASSWORD=your_password npm run screenshot
```

如果不设置，默认使用 `admin` / `admin123`

## 截图说明

脚本会自动截取以下页面：

### 公开页面（无需登录）
- 首页
- 登录页
- 注册页

### 需要登录的页面
- 创建帖子
- 个人资料
- 我的收藏
- 商家注册
- 商家管理

### 管理员页面（需要管理员权限）
- 管理员-仪表盘
- 管理员-用户管理
- 管理员-帖子审核
- 管理员-系统配置
- 管理员-系统日志

## 输出

所有截图保存在 `docs` 目录中，文件名格式为：`页面名称.png`

例如：
- `首页.png`
- `登录页.png`
- `创建帖子.png`
- `管理员-仪表盘.png`

## 注意事项

1. 确保前端服务正在运行
2. 确保有网络连接（如果需要加载外部资源）
3. 截图可能需要一些时间，请耐心等待
4. 如果某些页面需要登录但登录失败，这些页面将被跳过

