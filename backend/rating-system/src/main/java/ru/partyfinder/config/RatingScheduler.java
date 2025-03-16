package ru.partyfinder.config;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ru.partyfinder.service.RatingSystemService;

@Component
@RequiredArgsConstructor
public class RatingScheduler {

    private final RatingSystemService ratingSystemService;

    /**
     * Задача, выполняющаяся раз в 12 часов.
     */
    @Scheduled(fixedRateString = "${scheduler.cron.rating}")
    public void calculateRatingsProcedure() {
        System.out.println("Задача по расчету рейтингов запущена: " + java.time.LocalDateTime.now());
        calculateRating();
    }

    private void calculateRating() {
        ratingSystemService.countRatings();
    }
}