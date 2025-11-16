package com.housing.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorite")
@Data
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "house_id", nullable = false)
    private Long houseId;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    // 防止重复收藏
    @Column(name = "unique_key", length = 100)
    private String uniqueKey; // userId_houseId
}

