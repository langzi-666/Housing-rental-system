package com.housing.entity;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "house")
@Data
public class House {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(precision = 10, scale = 2)
    private BigDecimal area;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "room_type", length = 50)
    private String roomType;

    @Column(length = 50)
    private String floor;

    @Column(length = 20)
    private String orientation;

    @Column(length = 500)
    private String facilities;

    @Column(length = 1000)
    private String images;

    @Column(length = 20)
    private String status = "AVAILABLE";

    @Column(name = "landlord_id", nullable = false)
    private Long landlordId;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;
}

