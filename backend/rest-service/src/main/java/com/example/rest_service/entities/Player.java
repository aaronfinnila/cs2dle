package com.example.rest_service.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private float rating;
    private String birth_date;
    private String team;
    
    @Column(columnDefinition = "text[]")
    private String[] team_history;
    
    @Column(columnDefinition = "text[]")
    private String[] team_images;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public String getBirth_date() {
        return birth_date;
    }

    public void setBirth_date(String birth_date) {
        this.birth_date = birth_date;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String[] getTeam_history() {
        return team_history;
    }

    public void setTeam_history(String[] team_history) {
        this.team_history = team_history;
    }

    public String[] getTeam_images() {
        return team_images;
    }

    public void setTeam_images(String[] team_images) {
        this.team_images = team_images;
    }
}