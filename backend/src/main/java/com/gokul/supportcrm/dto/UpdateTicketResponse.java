package com.gokul.supportcrm.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateTicketResponse {

    private boolean success;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public UpdateTicketResponse(
            boolean success,
            LocalDateTime updatedAt) {

        this.success = success;
        this.updatedAt = updatedAt;
    }

    public boolean isSuccess() {
        return success;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}