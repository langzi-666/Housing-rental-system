package com.housing.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 200)
    private String title; // 通知标题

    @Column(columnDefinition = "TEXT")
    private String content; // 通知内容

    @Column(length = 20)
    private String type; // 类型：ORDER-订单，SYSTEM-系统，REPAIR-维修

    @Column(name = "related_id")
    private Long relatedId; // 关联ID（如订单ID、维修单ID）

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false; // 是否已读

    @Column(name = "create_time")
    private LocalDateTime createTime;
}

