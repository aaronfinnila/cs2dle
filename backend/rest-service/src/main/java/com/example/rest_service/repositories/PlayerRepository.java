package com.example.rest_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.rest_service.entities.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {

}
