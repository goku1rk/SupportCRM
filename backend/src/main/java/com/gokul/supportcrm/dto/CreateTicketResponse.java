package com.gokul.supportcrm.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;
public class CreateTicketResponse {
    @JsonProperty("ticket_id")
    private String ticketId;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    public CreateTicketResponse(
            String ticketId,
            LocalDateTime createdAt) {

        this.ticketId = ticketId;
        this.createdAt = createdAt;
    }

    public String getTicketId() {
        return ticketId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}