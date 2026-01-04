package com.example.rest_service.mappers;

import com.example.rest_service.dtos.ProductDto;
import com.example.rest_service.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(source = "category.id", target = "categoryId")
    ProductDto toDto(Product product);
}
