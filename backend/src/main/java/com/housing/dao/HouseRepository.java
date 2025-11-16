package com.housing.dao;

import com.housing.entity.House;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseRepository extends JpaRepository<House, Long> {
    List<House> findByStatus(String status);
    
    List<House> findByLandlordId(Long landlordId);
    
    @Query("SELECT h FROM House h WHERE h.status = 'AVAILABLE' AND " +
           "(h.title LIKE %:keyword% OR h.address LIKE %:keyword% OR h.description LIKE %:keyword%)")
    List<House> searchAvailableHouses(@Param("keyword") String keyword);
}

