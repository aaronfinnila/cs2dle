package com.example.rest_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.rest_service.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
