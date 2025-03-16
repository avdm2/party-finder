package ru.partyfinder;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RatingSystem {
    public static void main(String[] args) {
        System.out.println("Hello world!");
    }
}