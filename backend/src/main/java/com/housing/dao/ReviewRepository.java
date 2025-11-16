package com.housing.dao;

import com.housing.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHouseId(Long houseId);
    List<Review> findByLandlordId(Long landlordId);
    List<Review> findByTenantId(Long tenantId);
    List<Review> findByOrderId(Long orderId);
}

