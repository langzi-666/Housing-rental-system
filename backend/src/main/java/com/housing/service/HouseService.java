package com.housing.service;

import com.housing.dao.HouseRepository;
import com.housing.entity.House;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HouseService {
    @Autowired
    private HouseRepository houseRepository;

    public List<House> getAllHouses() {
        return houseRepository.findAll();
    }

    public List<House> getAvailableHouses() {
        return houseRepository.findByStatus("AVAILABLE");
    }

    public List<House> searchHouses(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAvailableHouses();
        }
        return houseRepository.searchAvailableHouses(keyword);
    }

    public House getHouseById(Long id) {
        return houseRepository.findById(id).orElse(null);
    }

    public List<House> getHousesByLandlord(Long landlordId) {
        return houseRepository.findByLandlordId(landlordId);
    }

    public House saveHouse(House house) {
        house.setCreateTime(LocalDateTime.now());
        house.setUpdateTime(LocalDateTime.now());
        return houseRepository.save(house);
    }

    public House updateHouse(House house) {
        house.setUpdateTime(LocalDateTime.now());
        return houseRepository.save(house);
    }

    public void deleteHouse(Long id) {
        houseRepository.deleteById(id);
    }
}

