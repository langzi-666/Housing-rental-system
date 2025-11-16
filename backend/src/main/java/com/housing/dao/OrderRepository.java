package com.housing.dao;

import com.housing.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByTenantId(Long tenantId);
    
    List<Order> findByLandlordId(Long landlordId);
    
    List<Order> findByHouseId(Long houseId);
}

