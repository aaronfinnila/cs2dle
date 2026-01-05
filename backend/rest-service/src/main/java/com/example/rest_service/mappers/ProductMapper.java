package com.example.rest_service.mappers;

import com.example.rest_service.dtos.ProductDto;
import com.example.rest_service.entities.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDto toDto(Product product);
}
