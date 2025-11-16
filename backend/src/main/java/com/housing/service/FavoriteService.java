package com.housing.service;

import com.housing.dao.FavoriteRepository;
import com.housing.entity.Favorite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteRepository favoriteRepository;

    public Favorite addFavorite(Long userId, Long houseId) {
        if (favoriteRepository.existsByUserIdAndHouseId(userId, houseId)) {
            throw new RuntimeException("已经收藏过该房源");
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setHouseId(houseId);
        favorite.setUniqueKey(userId + "_" + houseId);
        favorite.setCreateTime(LocalDateTime.now());
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long userId, Long houseId) {
        favoriteRepository.deleteByUserIdAndHouseId(userId, houseId);
    }

    public List<Favorite> getFavoritesByUserId(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public boolean isFavorite(Long userId, Long houseId) {
        return favoriteRepository.existsByUserIdAndHouseId(userId, houseId);
    }
}

