package com.decorhub.decorhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.decorhub.decorhub.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}