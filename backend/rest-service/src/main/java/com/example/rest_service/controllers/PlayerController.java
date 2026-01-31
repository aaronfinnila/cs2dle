package com.example.rest_service.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
        if (player == null) {
            return ResponseEntity.notFound().build();
        }
        RestTemplate restTemplate = new RestTemplate();
        byte[] imageBytes = restTemplate.getForObject(player.getImage(), byte[].class);
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(imageBytes);
    }
    
    @GetMapping("/{id}/team_image")
    public ResponseEntity<byte[]> getTeamImage(@PathVariable Long id) {
        Player player = playerRepository.findById(id).orElseThrow();
        if (player == null) {
            return ResponseEntity.notFound().build();
        }
        RestTemplate restTemplate = new RestTemplate();
        byte[] imageBytes = restTemplate.getForObject(player.getTeam_images().getLast(), byte[].class);
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(imageBytes);
    }

    @GetMapping("/{id}/team_image_{num}")
    public ResponseEntity<byte[]> getTeamImagesLatest(@PathVariable Long id, @PathVariable Integer num) {
        Player player = playerRepository.findById(id).orElseThrow();
        if (player == null) {
            return ResponseEntity.notFound().build();
        }
        RestTemplate restTemplate = new RestTemplate();
        byte[] imageBytes = restTemplate.getForObject(player.getTeam_images().get(player.getTeam_images().size()-(num)), byte[].class);
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(imageBytes);
    }

    @GetMapping("/get_id/{name}")
    public ResponseEntity<PlayerDto> getPlayerId(@PathVariable String name) {
        Player player = playerRepository.findByName(name).orElseThrow();
        if (player == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(playerMapper.toDto(player));
    }

    @PatchMapping("/{name}/{rating}_{majors}_{top20}")
    public ResponseEntity<PlayerDto> getPlayerId(@PathVariable String name, @PathVariable Float rating, @PathVariable Integer majors, @PathVariable Integer top20) {
        Player player = playerRepository.findByName(name).orElseThrow();
        if (player == null) {
            return ResponseEntity.notFound().build();
        }
        player.setRating(rating);
        player.setMajors(majors);
        player.setTop20(top20);
        playerRepository.save(player);
        return ResponseEntity.ok(playerMapper.toDto(player));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PlayerDto> deletePlayer(@PathVariable Long id) {
        Player player = playerRepository.findById(id).orElse(null);
        if (player == null) {
            return ResponseEntity.notFound().build();
        }
        playerRepository.delete(player);
        return ResponseEntity.ok(playerMapper.toDto(player));
    }
}