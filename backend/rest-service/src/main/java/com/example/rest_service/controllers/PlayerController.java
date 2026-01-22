package com.example.rest_service.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.rest_service.dtos.PlayerDto;
import com.example.rest_service.entities.Player;
import com.example.rest_service.mappers.PlayerMapper;
import com.example.rest_service.repositories.PlayerRepository;

@RestController
@RequestMapping("/players")
public class PlayerController {
    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;

    public PlayerController(PlayerRepository playerRepository, PlayerMapper playerMapper) {
        this.playerRepository = playerRepository;
        this.playerMapper = playerMapper;
    }

    @GetMapping
    public Iterable<PlayerDto> getAllPlayers() {
        return playerRepository.findAll()
            .stream()
            .map(playerMapper::toDto)
            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDto> getPlayer(@PathVariable Long id) {
        var player = playerRepository.findById(id).orElse(null);
        if (player == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(playerMapper.toDto(player));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getPlayerImage(@PathVariable Long id) {
        Player player = playerRepository.findById(id).orElseThrow();
        
        RestTemplate restTemplate = new RestTemplate();
        byte[] imageBytes = restTemplate.getForObject(player.getImage(), byte[].class);
        
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(imageBytes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PlayerDto> deletePlayer(@PathVariable(name = "id") Long id) {
        Player player = playerRepository.findById(id).orElse(null);
        if (player == null) {
            return ResponseEntity.notFound().build();
        }
        playerRepository.delete(player);
        return ResponseEntity.ok(playerMapper.toDto(player));
    }
}