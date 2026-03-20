package com.utcn.demo.controller;

import com.utcn.demo.entity.Product;
import com.utcn.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/product")
    public List<Product> getProducts() {
        return productService.findAll();
    }

    @PostMapping("/product")
    public Product addProduct(@RequestBody Product product) {
        return productService.save(product);
    }
}
