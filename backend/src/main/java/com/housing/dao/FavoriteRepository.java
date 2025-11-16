package com.housing.dao;

import com.housing.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserIdAndHouseId(Long userId, Long houseId);
    boolean existsByUserIdAndHouseId(Long userId, Long houseId);
    void deleteByUserIdAndHouseId(Long userId, Long houseId);
}

