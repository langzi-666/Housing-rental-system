package com.housing.controller;

import com.housing.dto.ApiResponse;
import com.housing.entity.Order;
import com.housing.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ApiResponse<Order> createOrder(@RequestBody Order order) {
        try {
            return ApiResponse.success("订单创建成功", orderService.createOrder(order));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{id}/confirm")
    public ApiResponse<Order> confirmOrder(@PathVariable Long id) {
        try {
            return ApiResponse.success("订单确认成功", orderService.confirmOrder(id));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<Order> cancelOrder(@PathVariable Long id) {
        try {
            return ApiResponse.success("订单取消成功", orderService.cancelOrder(id));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/tenant/{tenantId}")
    public ApiResponse<List<Order>> getOrdersByTenant(@PathVariable Long tenantId) {
        return ApiResponse.success(orderService.getOrdersByTenant(tenantId));
    }

    @GetMapping("/landlord/{landlordId}")
    public ApiResponse<List<Order>> getOrdersByLandlord(@PathVariable Long landlordId) {
        return ApiResponse.success(orderService.getOrdersByLandlord(landlordId));
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return ApiResponse.success(order);
        }
        return ApiResponse.error("订单不存在");
    }

    @GetMapping("/list")
    public ApiResponse<List<Order>> getAllOrders() {
        return ApiResponse.success(orderService.getAllOrders());
    }
}

