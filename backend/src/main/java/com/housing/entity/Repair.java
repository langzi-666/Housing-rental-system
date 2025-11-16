package com.housing.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair")
@Data
public class Repair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "house_id", nullable = false)
    private Long houseId;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "landlord_id", nullable = false)
    private Long landlordId;

    @Column(nullable = false, length = 200)
    private String title; // 报修标题

    @Column(columnDefinition = "TEXT")
    private String description; // 报修描述

    @Column(length = 500)
    private String images; // 图片URL（多个用逗号分隔）

    @Column(length = 20)
    private String status = "PENDING"; // 状态：PENDING-待处理，PROCESSING-处理中，COMPLETED-已完成，CANCELLED-已取消

    @Column(columnDefinition = "TEXT")
    private String reply; // 房东回复

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;
}

