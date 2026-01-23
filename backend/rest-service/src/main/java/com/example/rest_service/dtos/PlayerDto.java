package com.example.rest_service.dtos;

import java.util.List;

public class PlayerDto {
    private Long id;
    private String name;
    private String country;
    private Float rating;
    private String birth_date;
    private String team;
    private String image;
    private List<String> team_history;
    private List<String> team_images;

    public PlayerDto(Long id, String name, String country, Float rating, String birth_date, String team, String image, List<String> team_history, List<String> team_images) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.rating = rating;
        this.birth_date = birth_date;
        this.team = team;
        this.image = image;
        this.team_history = team_history;
        this.team_images = team_images;
    }

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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<String> getTeam_history() {
        return team_history;
    }

    public void setTeam_history(List<String> team_history) {
        this.team_history = team_history;
    }

    public List<String> getTeam_images() {
        return team_images;
    }

    public void setTeam_images(List<String> team_images) {
        this.team_images = team_images;
    }
}
