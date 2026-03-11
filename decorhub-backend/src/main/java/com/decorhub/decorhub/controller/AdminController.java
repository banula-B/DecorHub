package com.decorhub.decorhub.controller;

import com.decorhub.decorhub.entity.Product;
import com.decorhub.decorhub.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ProductRepository productRepository;

    public AdminController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable("id") Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        return productRepository.save(product);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable("id") Long id) {
        productRepository.deleteById(id);
    }

    @GetMapping("/products")
    public List<Product> listProducts() {
        return productRepository.findAll();
    }
}