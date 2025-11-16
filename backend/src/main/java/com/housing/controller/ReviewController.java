package com.housing.controller;

import com.housing.dto.ApiResponse;
import com.housing.entity.Review;
import com.housing.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ApiResponse<Review> createReview(@RequestBody Review review) {
        try {
            // 验证评分范围
            if (review.getRating() < 1 || review.getRating() > 5) {
                return ApiResponse.error("评分必须在1-5之间");
            }
            return ApiResponse.success(reviewService.createReview(review));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/house/{houseId}")
    public ApiResponse<List<Review>> getReviewsByHouseId(@PathVariable Long houseId) {
        return ApiResponse.success(reviewService.getReviewsByHouseId(houseId));
    }

    @GetMapping("/landlord/{landlordId}")
    public ApiResponse<List<Review>> getReviewsByLandlordId(@PathVariable Long landlordId) {
        return ApiResponse.success(reviewService.getReviewsByLandlordId(landlordId));
    }

    @GetMapping("/tenant/{tenantId}")
    public ApiResponse<List<Review>> getReviewsByTenantId(@PathVariable Long tenantId) {
        return ApiResponse.success(reviewService.getReviewsByTenantId(tenantId));
    }

    @GetMapping("/house/{houseId}/rating")
    public ApiResponse<Double> getAverageRating(@PathVariable Long houseId) {
        return ApiResponse.success(reviewService.getAverageRatingByHouseId(houseId));
    }

    @PutMapping("/{id}")
    public ApiResponse<Review> updateReview(@PathVariable Long id, @RequestBody Review review) {
        try {
            review.setId(id);
            return ApiResponse.success(reviewService.updateReview(review));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ApiResponse.success("删除成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}

