package com.housing.dao;

import com.housing.entity.Repair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Long> {
    List<Repair> findByTenantId(Long tenantId);
    List<Repair> findByLandlordId(Long landlordId);
    List<Repair> findByHouseId(Long houseId);
    List<Repair> findByStatus(String status);
}

