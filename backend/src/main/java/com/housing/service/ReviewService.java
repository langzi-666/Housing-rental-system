package com.housing.service;

import com.housing.dao.ReviewRepository;
import com.housing.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(Review review) {
        review.setCreateTime(LocalDateTime.now());
        review.setUpdateTime(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByHouseId(Long houseId) {
        return reviewRepository.findByHouseId(houseId);
    }

    public List<Review> getReviewsByLandlordId(Long landlordId) {
        return reviewRepository.findByLandlordId(landlordId);
    }

    public List<Review> getReviewsByTenantId(Long tenantId) {
        return reviewRepository.findByTenantId(tenantId);
    }

    public Review updateReview(Review review) {
        review.setUpdateTime(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    // 计算平均评分
    public Double getAverageRatingByHouseId(Long houseId) {
        List<Review> reviews = reviewRepository.findByHouseId(houseId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}

