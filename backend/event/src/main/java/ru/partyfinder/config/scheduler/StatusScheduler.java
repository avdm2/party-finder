package ru.partyfinder.config.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ru.partyfinder.service.EventStatusesCulculateService;

@Component
@RequiredArgsConstructor
public class StatusScheduler {

    private final EventStatusesCulculateService eventStatusesCulculateService;
    /**
     * Задача, выполняющаяся раз в час.
     */
    @Scheduled(cron = "${scheduler.cron.rating}")
    public void calculateRatingsProcedure() {
        System.out.println("Расчет статусов ивентов: " + java.time.LocalDateTime.now());
        calculateStatuses();
    }

    private void calculateStatuses() {
        eventStatusesCulculateService.calculateStatues();
    }
}


