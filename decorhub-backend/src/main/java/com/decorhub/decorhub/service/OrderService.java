package com.decorhub.decorhub.service;

import com.decorhub.decorhub.entity.Order;
import com.decorhub.decorhub.entity.OrderStatus;
import com.decorhub.decorhub.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {
        // Enforce new order rules
        order.setStatus(OrderStatus.PLACED);

        // Explicitly link each item back to the parent order
        // This is critical: JPA needs the bidirectional reference set or it will fail
        // to save
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order updateOrderStatus(Long orderId, String newStatusString) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(newStatusString.toUpperCase());
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + newStatusString);
        }

        return orderRepository.save(order);
    }
}
