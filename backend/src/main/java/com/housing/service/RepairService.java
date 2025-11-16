package com.housing.service;

import com.housing.dao.RepairRepository;
import com.housing.entity.Repair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RepairService {
    @Autowired
    private RepairRepository repairRepository;

    public Repair createRepair(Repair repair) {
        repair.setCreateTime(LocalDateTime.now());
        repair.setUpdateTime(LocalDateTime.now());
        repair.setStatus("PENDING");
        return repairRepository.save(repair);
    }

    public List<Repair> getRepairsByTenantId(Long tenantId) {
        return repairRepository.findByTenantId(tenantId);
    }

    public List<Repair> getRepairsByLandlordId(Long landlordId) {
        return repairRepository.findByLandlordId(landlordId);
    }

    public List<Repair> getRepairsByHouseId(Long houseId) {
        return repairRepository.findByHouseId(houseId);
    }

    public Repair updateRepair(Repair repair) {
        repair.setUpdateTime(LocalDateTime.now());
        return repairRepository.save(repair);
    }

    public Repair updateRepairStatus(Long id, String status, String reply) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("报修单不存在"));
        repair.setStatus(status);
        if (reply != null) {
            repair.setReply(reply);
        }
        repair.setUpdateTime(LocalDateTime.now());
        return repairRepository.save(repair);
    }

    public void deleteRepair(Long id) {
        repairRepository.deleteById(id);
    }

    public Repair getRepairById(Long id) {
        return repairRepository.findById(id).orElse(null);
    }
}

