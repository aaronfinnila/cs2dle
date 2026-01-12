package com.example.rest_service.mappers;

import com.example.rest_service.dtos.RegisterUserRequest;
import com.example.rest_service.dtos.UpdateUserRequest;
import com.example.rest_service.dtos.UserDto;
import com.example.rest_service.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
    User toUser(RegisterUserRequest request);
    void update(UpdateUserRequest request, @MappingTarget User user);
}
