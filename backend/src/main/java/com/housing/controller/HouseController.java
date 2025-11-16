package com.housing.controller;

import com.housing.dto.ApiResponse;
import com.housing.entity.House;
import com.housing.service.HouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/house")
public class HouseController {
    @Autowired
    private HouseService houseService;

    @GetMapping("/list")
    public ApiResponse<List<House>> getAllHouses() {
        return ApiResponse.success(houseService.getAllHouses());
    }

    @GetMapping("/available")
    public ApiResponse<List<House>> getAvailableHouses() {
        return ApiResponse.success(houseService.getAvailableHouses());
    }

    @GetMapping("/search")
    public ApiResponse<List<House>> searchHouses(@RequestParam(required = false) String keyword) {
        return ApiResponse.success(houseService.searchHouses(keyword));
    }

    @GetMapping("/{id}")
    public ApiResponse<House> getHouseById(@PathVariable Long id) {
        House house = houseService.getHouseById(id);
        if (house != null) {
            return ApiResponse.success(house);
        }
        return ApiResponse.error("房屋不存在");
    }

    @GetMapping("/landlord/{landlordId}")
    public ApiResponse<List<House>> getHousesByLandlord(@PathVariable Long landlordId) {
        return ApiResponse.success(houseService.getHousesByLandlord(landlordId));
    }

    @PostMapping
    public ApiResponse<House> createHouse(@RequestBody House house) {
        return ApiResponse.success("创建成功", houseService.saveHouse(house));
    }

    @PutMapping("/{id}")
    public ApiResponse<House> updateHouse(@PathVariable Long id, @RequestBody House house) {
        house.setId(id);
        return ApiResponse.success(houseService.updateHouse(house));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteHouse(@PathVariable Long id) {
        houseService.deleteHouse(id);
        return ApiResponse.success("删除成功", null);
    }
}

