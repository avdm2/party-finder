package ru.partyfinder.entity;

import lombok.Builder;

import java.util.UUID;

// Сущность канала
@Builder
public record Channel(UUID id, String name, String ownerUsername) {
}
