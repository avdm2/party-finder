package ru.partyfinder.entity;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record Message(UUID id, UUID channelId, String content, LocalDateTime createdAt) {}