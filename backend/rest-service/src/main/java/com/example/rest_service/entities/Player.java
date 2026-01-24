package com.example.rest_service.entities;

import jakarta.persistence.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String country;
    @Column(nullable = true)
    private Float rating;
    private String birth_date;
    private String team;
    private String image;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "team_history", columnDefinition = "jsonb")
    private List<String> team_history;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "team_images", columnDefinition = "jsonb")
    private List<String> team_images;
    
    private String roles;
    private Integer majors;
    private Integer top20;

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

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public Integer getMajors() {
        return majors;
    }

    public void setMajors(Integer majors) {
        this.majors = majors;
    }

    public Integer getTop20() {
        return top20;
    }

    public void setTop20(Integer top20) {
        this.top20 = top20;
    }
}