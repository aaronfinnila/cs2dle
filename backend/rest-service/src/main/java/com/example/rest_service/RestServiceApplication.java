package com.example.rest_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class RestServiceApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		
		setIfPresent("DB_USER", dotenv);
        setIfPresent("DB_PASSWORD", dotenv);
        setIfPresent("DB_URL", dotenv);
        setIfPresent("APP_API_KEY", dotenv);

		SpringApplication.run(RestServiceApplication.class, args);
	}

	private static void setIfPresent(String key, Dotenv dotenv) {
        String value = dotenv.get(key);
        if (value != null && System.getenv(key) == null) {
            System.setProperty(key, value);
        }
	}
}