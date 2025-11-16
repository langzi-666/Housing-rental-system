package com.housing.controller;

import com.housing.dto.ApiResponse;
import com.housing.entity.Repair;
import com.housing.service.RepairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repair")
@CrossOrigin(origins = "*")
public class RepairController {
    @Autowired
    private RepairService repairService;

    @PostMapping
    public ApiResponse<Repair> createRepair(@RequestBody Repair repair) {
        try {
            return ApiResponse.success(repairService.createRepair(repair));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/tenant/{tenantId}")
    public ApiResponse<List<Repair>> getRepairsByTenantId(@PathVariable Long tenantId) {
        return ApiResponse.success(repairService.getRepairsByTenantId(tenantId));
    }

    @GetMapping("/landlord/{landlordId}")
    public ApiResponse<List<Repair>> getRepairsByLandlordId(@PathVariable Long landlordId) {
        return ApiResponse.success(repairService.getRepairsByLandlordId(landlordId));
    }

    @GetMapping("/house/{houseId}")
    public ApiResponse<List<Repair>> getRepairsByHouseId(@PathVariable Long houseId) {
        return ApiResponse.success(repairService.getRepairsByHouseId(houseId));
    }

    @GetMapping("/{id}")
    public ApiResponse<Repair> getRepairById(@PathVariable Long id) {
        Repair repair = repairService.getRepairById(id);
        if (repair != null) {
            return ApiResponse.success(repair);
        }
        return ApiResponse.error("报修单不存在");
    }

    @PutMapping("/{id}")
    public ApiResponse<Repair> updateRepair(@PathVariable Long id, @RequestBody Repair repair) {
        try {
            repair.setId(id);
            return ApiResponse.success(repairService.updateRepair(repair));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Repair> updateRepairStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String reply = request.get("reply");
            return ApiResponse.success(repairService.updateRepairStatus(id, status, reply));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRepair(@PathVariable Long id) {
        try {
            repairService.deleteRepair(id);
            return ApiResponse.success("删除成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}

