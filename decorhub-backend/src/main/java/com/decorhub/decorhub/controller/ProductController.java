package com.decorhub.decorhub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.decorhub.decorhub.entity.Product;
import com.decorhub.decorhub.service.ProductService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product addProduct(@Valid @RequestBody Product product) {
        return productService.addProduct(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable("id") Long id, @Valid @RequestBody Product productDetails) {
        return productService.updateProduct(id, productDetails);
    }
}