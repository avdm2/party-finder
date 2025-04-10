package ru.partyfinder.config.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ru.partyfinder.service.RatingSystemService;


@Slf4j
@Component
@RequiredArgsConstructor
public class RatingScheduler {

    private final RatingSystemService ratingSystemService;

    /**
     * Задача, выполняющаяся раз в 12 часов.
     */
    @Scheduled(cron = "${scheduler.cron.rating}")
    public void calculateRatingsProcedure() {
        System.out.println("Задача по расчету рейтингов запущена: " + java.time.LocalDateTime.now());
        calculateRating();
    }

    private void calculateRating() {
        ratingSystemService.countRatings();
    }
}