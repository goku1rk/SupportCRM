package com.gokul.supportcrm.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

public class NoteResponse {

    @JsonProperty("note_text")
    private String noteText;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    public NoteResponse(
            String noteText,
            LocalDateTime createdAt) {

        this.noteText = noteText;
        this.createdAt = createdAt;
    }

    public String getNoteText() {
        return noteText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}