package com.housing.service;

import com.housing.dao.HouseRepository;
import com.housing.dao.OrderRepository;
import com.housing.entity.House;
import com.housing.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private HouseRepository houseRepository;

    public Order createOrder(Order order) {
        House house = houseRepository.findById(order.getHouseId()).orElse(null);
        if (house == null) {
            throw new RuntimeException("房屋不存在");
        }
        if (!"AVAILABLE".equals(house.getStatus())) {
            throw new RuntimeException("房屋不可租");
        }

        // 计算总金额
        long months = ChronoUnit.MONTHS.between(order.getRentStartDate(), order.getRentEndDate());
        if (months <= 0) {
            throw new RuntimeException("租期无效");
        }
        order.setTotalAmount(order.getMonthlyRent().multiply(java.math.BigDecimal.valueOf(months)));

        // 生成订单号
        order.setOrderNo("ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Order confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        order.setStatus("CONFIRMED");
        order.setUpdateTime(LocalDateTime.now());

        // 更新房屋状态
        House house = houseRepository.findById(order.getHouseId()).orElse(null);
        if (house != null) {
            house.setStatus("RENTED");
            houseRepository.save(house);
        }

        return orderRepository.save(order);
    }

    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        order.setStatus("CANCELLED");
        order.setUpdateTime(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByTenant(Long tenantId) {
        return orderRepository.findByTenantId(tenantId);
    }

    public List<Order> getOrdersByLandlord(Long landlordId) {
        return orderRepository.findByLandlordId(landlordId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}

