package com.housing.controller;

import com.housing.dto.ApiResponse;
import com.housing.entity.Favorite;
import com.housing.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorite")
@CrossOrigin(origins = "*")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;

    @PostMapping
    public ApiResponse<Favorite> addFavorite(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long houseId = request.get("houseId");
            return ApiResponse.success(favoriteService.addFavorite(userId, houseId));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/{houseId}")
    public ApiResponse<Void> removeFavorite(@PathVariable Long userId, @PathVariable Long houseId) {
        try {
            favoriteService.removeFavorite(userId, houseId);
            return ApiResponse.success("取消收藏成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Favorite>> getFavoritesByUserId(@PathVariable Long userId) {
        return ApiResponse.success(favoriteService.getFavoritesByUserId(userId));
    }

    @GetMapping("/check/{userId}/{houseId}")
    public ApiResponse<Map<String, Object>> checkFavorite(@PathVariable Long userId, @PathVariable Long houseId) {
        Map<String, Object> result = new HashMap<>();
        result.put("isFavorite", favoriteService.isFavorite(userId, houseId));
        return ApiResponse.success(result);
    }
}

