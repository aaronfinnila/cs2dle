package com.example.rest_service.mappers;

import org.mapstruct.Mapper;

import com.example.rest_service.dtos.PlayerDto;
import com.example.rest_service.entities.Player;

@Mapper(componentModel = "spring")
public interface PlayerMapper {
    PlayerDto toDto(Player player);
}
