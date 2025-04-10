package ru.partyfinder.entity;

import lombok.Builder;

import java.util.UUID;

// сущность подписчика (таблица содержит в себе всех подписчиков всех каналов)
@Builder
public record Subscriber(UUID id, UUID channelId, UUID subscriberId) {
}
