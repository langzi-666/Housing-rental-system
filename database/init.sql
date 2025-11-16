-- 创建数据库
CREATE DATABASE IF NOT EXISTS housing_rental DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE housing_rental;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `real_name` VARCHAR(50) COMMENT '真实姓名',
    `phone` VARCHAR(20) COMMENT '手机号',
    `email` VARCHAR(100) COMMENT '邮箱',
    `role` VARCHAR(20) DEFAULT 'USER' COMMENT '角色：USER-租客，LANDLORD-房东，ADMIN-管理员',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 房屋表
CREATE TABLE IF NOT EXISTS `house` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL COMMENT '房屋标题',
    `description` TEXT COMMENT '房屋描述',
    `address` VARCHAR(500) NOT NULL COMMENT '地址',
    `area` DECIMAL(10, 2) COMMENT '面积（平方米）',
    `price` DECIMAL(10, 2) NOT NULL COMMENT '月租金',
    `room_type` VARCHAR(50) COMMENT '户型（如：一室一厅）',
    `floor` VARCHAR(50) COMMENT '楼层',
    `orientation` VARCHAR(20) COMMENT '朝向',
    `facilities` VARCHAR(500) COMMENT '设施（JSON格式）',
    `images` VARCHAR(1000) COMMENT '图片URL（多个用逗号分隔）',
    `status` VARCHAR(20) DEFAULT 'AVAILABLE' COMMENT '状态：AVAILABLE-可租，RENTED-已租，OFFLINE-下架',
    `landlord_id` BIGINT NOT NULL COMMENT '房东ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (`landlord_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房屋表';

-- 订单表
CREATE TABLE IF NOT EXISTS `order` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `order_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    `house_id` BIGINT NOT NULL COMMENT '房屋ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租客ID',
    `landlord_id` BIGINT NOT NULL COMMENT '房东ID',
    `rent_start_date` DATE NOT NULL COMMENT '租期开始日期',
    `rent_end_date` DATE NOT NULL COMMENT '租期结束日期',
    `monthly_rent` DECIMAL(10, 2) NOT NULL COMMENT '月租金',
    `total_amount` DECIMAL(10, 2) NOT NULL COMMENT '总金额',
    `status` VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING-待确认，CONFIRMED-已确认，COMPLETED-已完成，CANCELLED-已取消',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (`house_id`) REFERENCES `house`(`id`),
    FOREIGN KEY (`tenant_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`landlord_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- ==================== 插入测试数据 ====================

-- 插入所有用户数据（确保ID连续）
INSERT INTO `user` (`username`, `password`, `real_name`, `phone`, `email`, `role`) VALUES
('admin', 'admin123', '管理员', '13800138000', 'admin@example.com', 'ADMIN'),
('landlord1', '123456', '张房东', '13800138001', 'landlord1@example.com', 'LANDLORD'),
('tenant1', '123456', '李租客', '13800138002', 'tenant1@example.com', 'USER'),
('landlord2', '123456', '王房东', '13800138003', 'landlord2@example.com', 'LANDLORD'),
('landlord3', '123456', '刘房东', '13800138004', 'landlord3@example.com', 'LANDLORD'),
('tenant2', '123456', '张租客', '13800138005', 'tenant2@example.com', 'USER'),
('tenant3', '123456', '王租客', '13800138006', 'tenant3@example.com', 'USER'),
('tenant4', '123456', '赵租客', '13800138007', 'tenant4@example.com', 'USER'),
('tenant5', '123456', '陈租客', '13800138008', 'tenant5@example.com', 'USER');

-- 插入房屋数据
INSERT INTO `house` (`title`, `description`, `address`, `area`, `price`, `room_type`, `floor`, `orientation`, `facilities`, `status`, `landlord_id`) VALUES
('精装一室一厅，交通便利', '房屋精装修，家具家电齐全，拎包入住', '北京市朝阳区某某街道123号', 45.5, 3500.00, '一室一厅', '5/10', '南', '["空调","洗衣机","冰箱","WiFi"]', 'AVAILABLE', 2),
('温馨两室一厅，采光好', '南北通透，采光充足，适合家庭居住', '北京市海淀区某某路456号', 80.0, 5500.00, '两室一厅', '8/15', '南北', '["空调","洗衣机","冰箱","WiFi","电视"]', 'AVAILABLE', 2),
('豪华三室两厅，精装修', '高档小区，环境优美，配套设施完善', '北京市西城区某某大街789号', 120.0, 8500.00, '三室两厅', '12/20', '南', '["空调","洗衣机","冰箱","WiFi","电视","热水器"]', 'AVAILABLE', 2),
('市中心一室一厅，地铁口', '地理位置优越，步行5分钟到地铁站，周边配套设施齐全', '北京市东城区某某路100号', 50.0, 4200.00, '一室一厅', '3/8', '东', '["空调","洗衣机","冰箱","WiFi","电视"]', 'AVAILABLE', 2),
('舒适两室一厅，近学校', '学区房，周边有多所优质学校，适合有孩子的家庭', '北京市海淀区某某街200号', 85.0, 6000.00, '两室一厅', '6/12', '南', '["空调","洗衣机","冰箱","WiFi","电视","热水器","暖气"]', 'AVAILABLE', 2),
('豪华一室一厅，精装修', '高档公寓，24小时保安，环境优雅，适合白领居住', '北京市朝阳区某某大道300号', 55.0, 4800.00, '一室一厅', '15/20', '南', '["空调","洗衣机","冰箱","WiFi","电视","热水器","地暖"]', 'AVAILABLE', 4),
('经济实惠单间，拎包入住', '价格实惠，适合刚毕业的年轻人，交通便利', '北京市丰台区某某路400号', 25.0, 2000.00, '单间', '2/6', '北', '["空调","WiFi"]', 'AVAILABLE', 4),
('温馨三室两厅，全家首选', '大户型，适合三代同堂，小区环境优美，物业管理完善', '北京市西城区某某街500号', 130.0, 9500.00, '三室两厅', '10/18', '南北', '["空调","洗衣机","冰箱","WiFi","电视","热水器","暖气","地暖"]', 'AVAILABLE', 5),
('现代两室一厅，新装修', '全新装修，家具家电全新，首次出租，干净整洁', '北京市昌平区某某路600号', 75.0, 5200.00, '两室一厅', '5/10', '南', '["空调","洗衣机","冰箱","WiFi","电视","热水器"]', 'AVAILABLE', 5),
('loft复式公寓，时尚潮流', 'loft户型，空间利用率高，适合年轻人，装修时尚', '北京市通州区某某街700号', 60.0, 4500.00, 'loft', '8/15', '南', '["空调","洗衣机","冰箱","WiFi","电视"]', 'AVAILABLE', 4),
('一室一厅，近CBD', '距离CBD仅10分钟车程，适合在CBD工作的白领', '北京市朝阳区某某路800号', 48.0, 4000.00, '一室一厅', '12/25', '南', '["空调","洗衣机","冰箱","WiFi","电视","热水器"]', 'RENTED', 2);

-- 评价表
CREATE TABLE IF NOT EXISTS `review` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `house_id` BIGINT NOT NULL COMMENT '房屋ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租客ID',
    `landlord_id` BIGINT NOT NULL COMMENT '房东ID',
    `order_id` BIGINT COMMENT '订单ID',
    `rating` INT NOT NULL COMMENT '评分 1-5',
    `content` TEXT COMMENT '评价内容',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (`house_id`) REFERENCES `house`(`id`),
    FOREIGN KEY (`tenant_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`landlord_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

-- 收藏表
CREATE TABLE IF NOT EXISTS `favorite` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `house_id` BIGINT NOT NULL COMMENT '房屋ID',
    `unique_key` VARCHAR(100) UNIQUE COMMENT '唯一键 userId_houseId',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`house_id`) REFERENCES `house`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 通知表
CREATE TABLE IF NOT EXISTS `notification` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `title` VARCHAR(200) NOT NULL COMMENT '通知标题',
    `content` TEXT COMMENT '通知内容',
    `type` VARCHAR(20) COMMENT '类型：ORDER-订单，SYSTEM-系统，REPAIR-维修',
    `related_id` BIGINT COMMENT '关联ID',
    `is_read` BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';

-- 维修报修表
CREATE TABLE IF NOT EXISTS `repair` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `house_id` BIGINT NOT NULL COMMENT '房屋ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租客ID',
    `landlord_id` BIGINT NOT NULL COMMENT '房东ID',
    `title` VARCHAR(200) NOT NULL COMMENT '报修标题',
    `description` TEXT COMMENT '报修描述',
    `images` VARCHAR(500) COMMENT '图片URL（多个用逗号分隔）',
    `status` VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING-待处理，PROCESSING-处理中，COMPLETED-已完成，CANCELLED-已取消',
    `reply` TEXT COMMENT '房东回复',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (`house_id`) REFERENCES `house`(`id`),
    FOREIGN KEY (`tenant_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`landlord_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='维修报修表';


-- 插入订单数据
-- 注意：house_id对应的landlord_id必须匹配
-- house_id=1: landlord_id=2, price=3500
-- house_id=2: landlord_id=2, price=5500
-- house_id=3: landlord_id=2, price=8500
-- house_id=4: landlord_id=2, price=4200
-- house_id=5: landlord_id=2, price=6000
-- house_id=6: landlord_id=4, price=4800
-- house_id=7: landlord_id=4, price=2000
-- house_id=8: landlord_id=5, price=9500
-- house_id=9: landlord_id=5, price=5200
-- house_id=10: landlord_id=4, price=4500
-- house_id=11: landlord_id=2, price=4000
INSERT INTO `order` (`order_no`, `house_id`, `tenant_id`, `landlord_id`, `rent_start_date`, `rent_end_date`, `monthly_rent`, `total_amount`, `status`, `create_time`) VALUES
('ORD20240101001', 11, 3, 2, '2024-01-01', '2024-12-31', 4000.00, 48000.00, 'CONFIRMED', '2023-12-20 10:00:00'),
('ORD20240115001', 1, 6, 2, '2024-02-01', '2025-01-31', 3500.00, 42000.00, 'PENDING', '2024-01-15 14:30:00'),
('ORD20240201001', 2, 7, 2, '2024-03-01', '2025-02-28', 5500.00, 66000.00, 'CONFIRMED', '2024-02-01 09:15:00'),
('ORD20240215001', 6, 8, 4, '2024-04-01', '2025-03-31', 4800.00, 57600.00, 'COMPLETED', '2024-02-15 16:20:00'),
('ORD20240301001', 7, 3, 4, '2024-05-01', '2025-04-30', 2000.00, 24000.00, 'CANCELLED', '2024-03-01 11:45:00'),
('ORD20240315001', 8, 6, 5, '2024-06-01', '2025-05-31', 9500.00, 114000.00, 'PENDING', '2024-03-15 13:10:00');

-- 插入评价数据
INSERT INTO `review` (`house_id`, `tenant_id`, `landlord_id`, `order_id`, `rating`, `content`, `create_time`) VALUES
(11, 3, 2, 1, 5, '房屋位置非常好，交通便利，房东人很好，回复及时，房屋干净整洁，非常满意！', '2024-01-05 10:00:00'),
(1, 6, 2, 2, 4, '房子不错，装修精美，设施齐全，就是价格稍微有点高，但整体还是很满意的。', '2024-01-20 15:30:00'),
(2, 7, 2, 3, 5, '非常满意的一次租房体验！房屋采光好，空间大，房东服务态度很好，强烈推荐！', '2024-02-05 09:20:00'),
(6, 8, 4, 4, 4, '房子很好，地理位置优越，周边配套设施完善，房东很负责任，值得推荐。', '2024-02-20 14:15:00'),
(3, 3, 2, NULL, 5, '虽然还没租，但看房后感觉非常好，房屋装修豪华，设施完善，房东也很热情。', '2024-01-10 11:00:00'),
(7, 6, 4, NULL, 4, '看房后觉得不错，价格实惠，适合刚毕业的年轻人，交通也很方便。', '2024-02-10 16:30:00');

-- 插入收藏数据
INSERT INTO `favorite` (`user_id`, `house_id`, `unique_key`) VALUES
(3, 1, '3_1'),
(3, 2, '3_2'),
(3, 3, '3_3'),
(6, 4, '6_4'),
(6, 5, '6_5'),
(6, 6, '6_6'),
(7, 1, '7_1'),
(7, 3, '7_3'),
(7, 7, '7_7'),
(8, 2, '8_2'),
(8, 6, '8_6'),
(8, 8, '8_8');

-- 插入通知数据
INSERT INTO `notification` (`user_id`, `title`, `content`, `type`, `related_id`, `is_read`, `create_time`) VALUES
-- 租客通知
(3, '订单确认通知', '您的订单 ORD20240101001 已被房东确认，请按时入住。', 'ORDER', 1, FALSE, '2024-01-01 10:30:00'),
(3, '订单提醒', '您的订单 ORD20240101001 即将到期，请及时续租或退房。', 'ORDER', 1, FALSE, '2024-12-01 09:00:00'),
(6, '新订单通知', '您有新的订单 ORD20240115001 待确认，请及时处理。', 'ORDER', 2, FALSE, '2024-01-15 14:35:00'),
(7, '订单确认通知', '您的订单 ORD20240201001 已被房东确认。', 'ORDER', 3, TRUE, '2024-02-01 09:20:00'),
(8, '订单完成通知', '您的订单 ORD20240215001 已完成，感谢您的使用！', 'ORDER', 4, TRUE, '2024-02-20 16:25:00'),
(3, '系统通知', '欢迎使用房屋租赁系统！', 'SYSTEM', NULL, FALSE, '2024-01-01 08:00:00'),
(6, '系统通知', '您的账户已成功注册，祝您找到心仪的房子！', 'SYSTEM', NULL, TRUE, '2024-01-10 10:00:00'),
-- 房东通知
(2, '新订单通知', '您有新的订单 ORD20240115001 待确认，租客：张租客。', 'ORDER', 2, FALSE, '2024-01-15 14:30:00'),
(2, '新评价通知', '您收到一条新评价，来自租客：李租客，评分：5分。', 'SYSTEM', NULL, FALSE, '2024-01-05 10:05:00'),
(2, '新评价通知', '您收到一条新评价，来自租客：张租客，评分：4分。', 'SYSTEM', NULL, FALSE, '2024-01-20 15:35:00'),
(4, '订单完成通知', '订单 ORD20240215001 已完成，租客：赵租客。', 'ORDER', 4, TRUE, '2024-02-20 16:20:00'),
(4, '新评价通知', '您收到一条新评价，来自租客：赵租客，评分：4分。', 'SYSTEM', NULL, TRUE, '2024-02-20 14:20:00'),
(5, '新订单通知', '您有新的订单 ORD20240315001 待确认，租客：张租客。', 'ORDER', 6, FALSE, '2024-03-15 13:15:00');

-- 插入维修报修数据
INSERT INTO `repair` (`house_id`, `tenant_id`, `landlord_id`, `title`, `description`, `images`, `status`, `reply`, `create_time`, `update_time`) VALUES
(11, 3, 2, '空调不制冷', '客厅的空调突然不制冷了，可能是缺氟或者故障，请尽快安排维修。', NULL, 'PROCESSING', '已联系维修师傅，预计明天上午上门检查。', '2024-01-10 15:00:00', '2024-01-10 16:30:00'),
(11, 3, 2, '水龙头漏水', '厨房的水龙头一直漏水，已经用盆接水了，请尽快维修。', NULL, 'COMPLETED', '已安排师傅维修，问题已解决。', '2024-01-15 09:00:00', '2024-01-16 14:00:00'),
(1, 6, 2, '门锁故障', '大门门锁有时候打不开，需要多次尝试才能打开，存在安全隐患。', NULL, 'PENDING', NULL, '2024-01-20 10:30:00', '2024-01-20 10:30:00'),
(2, 7, 2, 'WiFi信号弱', '房间里的WiFi信号很弱，经常断线，影响正常使用。', NULL, 'PROCESSING', '已联系网络运营商，正在排查问题。', '2024-02-05 14:00:00', '2024-02-05 15:00:00'),
(6, 8, 4, '热水器不工作', '热水器无法加热，已经检查了电源，没有问题，可能是设备故障。', NULL, 'COMPLETED', '已更换新的热水器，现在可以正常使用了。', '2024-02-10 11:00:00', '2024-02-12 16:00:00'),
(6, 8, 4, '窗户关不严', '卧室的窗户关不严，有漏风现象，冬天比较冷。', NULL, 'PENDING', NULL, '2024-02-15 09:30:00', '2024-02-15 09:30:00'),
(8, 6, 5, '下水道堵塞', '卫生间的下水道堵塞了，水排不下去，请尽快处理。', NULL, 'PROCESSING', '已联系疏通师傅，今天下午上门处理。', '2024-03-10 08:00:00', '2024-03-10 10:00:00');

-- 为维修报修添加通知
INSERT INTO `notification` (`user_id`, `title`, `content`, `type`, `related_id`, `is_read`, `create_time`) VALUES
(2, '维修报修通知', '租客李租客提交了维修报修：空调不制冷，请及时处理。', 'REPAIR', 1, FALSE, '2024-01-10 15:05:00'),
(2, '维修报修通知', '租客张租客提交了维修报修：门锁故障，请及时处理。', 'REPAIR', 3, FALSE, '2024-01-20 10:35:00'),
(2, '维修报修通知', '租客王租客提交了维修报修：WiFi信号弱，请及时处理。', 'REPAIR', 4, FALSE, '2024-02-05 14:05:00'),
(4, '维修报修通知', '租客赵租客提交了维修报修：热水器不工作，请及时处理。', 'REPAIR', 5, TRUE, '2024-02-10 11:05:00'),
(4, '维修报修通知', '租客赵租客提交了维修报修：窗户关不严，请及时处理。', 'REPAIR', 6, FALSE, '2024-02-15 09:35:00'),
(5, '维修报修通知', '租客张租客提交了维修报修：下水道堵塞，请及时处理。', 'REPAIR', 7, FALSE, '2024-03-10 08:05:00'),
(3, '维修处理通知', '您的维修报修"空调不制冷"已开始处理，房东已回复。', 'REPAIR', 1, FALSE, '2024-01-10 16:35:00'),
(3, '维修完成通知', '您的维修报修"水龙头漏水"已完成，问题已解决。', 'REPAIR', 2, TRUE, '2024-01-16 14:05:00'),
(7, '维修处理通知', '您的维修报修"WiFi信号弱"已开始处理，房东已回复。', 'REPAIR', 4, TRUE, '2024-02-05 15:05:00'),
(8, '维修完成通知', '您的维修报修"热水器不工作"已完成，问题已解决。', 'REPAIR', 5, TRUE, '2024-02-12 16:05:00'),
(6, '维修处理通知', '您的维修报修"下水道堵塞"已开始处理，房东已回复。', 'REPAIR', 7, FALSE, '2024-03-10 10:05:00');

