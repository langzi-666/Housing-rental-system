# 房屋租赁系统

一个基于 Spring Boot + Vue 的房屋租赁管理系统，适合作为大学生毕业设计项目。

## 技术栈

### 后端
- Spring Boot 2.7.14
- Spring Data JPA
- MySQL 8.0
- Maven

### 前端
- Vue 3
- Axios
- 原生 HTML/CSS/JavaScript

## 功能特性

1. **用户管理**
   - 用户注册/登录
   - 支持三种角色：租客(USER)、房东(LANDLORD)、管理员(ADMIN)

2. **房屋管理**
   - 房屋信息展示（列表、详情）
   - 房屋搜索功能
   - 房东可以添加、编辑、删除房源
   - 房屋状态管理（可租、已租、下架）

3. **订单管理**
   - 租客可以创建订单
   - 房东可以确认/取消订单
   - 订单状态跟踪

## 项目结构

```
Housing rental system/
├── backend/                    # 后端Spring Boot项目
│   ├── src/
│   │   └── main/
│   │       ├── java/com/housing/
│   │       │   ├── entity/     # 实体类
│   │       │   ├── dao/        # 数据访问层
│   │       │   ├── service/    # 业务逻辑层
│   │       │   ├── controller/ # 控制器层
│   │       │   ├── dto/        # 数据传输对象
│   │       │   └── config/     # 配置类
│   │       └── resources/
│   │           └── application.yml
│   └── pom.xml
├── frontend/                   # 前端Vue项目
│   ├── index.html
│   ├── app.js
│   └── style.css
├── database/                   # 数据库脚本
│   └── init.sql
└── README.md
```

## 快速开始

### 1. 数据库准备

1. 确保 MySQL 已安装并运行
2. 执行 `database/init.sql` 脚本创建数据库和表结构
3. 数据库配置：
   - 地址：localhost:3306
   - 数据库名：housing_rental
   - 用户名：root
   - 密码：123456

### 2. 后端启动

1. 确保已安装 JDK 1.8+ 和 Maven
2. 进入 `backend` 目录
3. 运行以下命令：

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

或者使用 IDE（如 IntelliJ IDEA）直接运行 `HousingRentalApplication.java`

后端服务将在 `http://localhost:8080` 启动

### 3. 前端启动

1. 进入 `frontend` 目录
2. 使用任意 HTTP 服务器启动（推荐使用 VS Code 的 Live Server 插件）
3. 或者使用 Python 简单服务器：

```bash
cd frontend
python -m http.server 8000
```

前端页面将在 `http://localhost:8000` 访问

### 4. 访问系统

打开浏览器访问前端地址，默认会显示登录页面。

**测试账号：**
- 管理员：admin / admin123
- 房东：landlord1 / 123456
- 租客：tenant1 / 123456

## API 接口说明

### 用户相关
- `POST /api/user/login` - 用户登录
- `POST /api/user/register` - 用户注册
- `GET /api/user/list` - 获取所有用户
- `GET /api/user/{id}` - 获取用户信息

### 房屋相关
- `GET /api/house/list` - 获取所有房屋
- `GET /api/house/available` - 获取可租房屋
- `GET /api/house/search?keyword=xxx` - 搜索房屋
- `GET /api/house/{id}` - 获取房屋详情
- `GET /api/house/landlord/{landlordId}` - 获取房东的房源
- `POST /api/house` - 创建房屋
- `PUT /api/house/{id}` - 更新房屋
- `DELETE /api/house/{id}` - 删除房屋

### 订单相关
- `POST /api/order` - 创建订单
- `PUT /api/order/{id}/confirm` - 确认订单
- `PUT /api/order/{id}/cancel` - 取消订单
- `GET /api/order/tenant/{tenantId}` - 获取租客订单
- `GET /api/order/landlord/{landlordId}` - 获取房东订单
- `GET /api/order/{id}` - 获取订单详情

## 注意事项

1. 确保 MySQL 服务已启动
2. 确保后端服务启动后再访问前端
3. 如果端口被占用，可以修改 `application.yml` 中的端口配置
4. 前端 API 地址配置在 `app.js` 中的 `apiBaseUrl` 变量

## 开发说明

这是一个基础的毕业设计项目，包含了基本的 CRUD 功能。如需扩展功能，可以：

1. 添加图片上传功能
2. 添加支付功能
3. 添加评价系统
4. 添加消息通知功能
5. 添加数据统计功能
6. 优化前端 UI/UX
7. 添加权限控制（JWT）
8. 添加数据验证和异常处理

## 许可证

本项目仅供学习和毕业设计使用。

