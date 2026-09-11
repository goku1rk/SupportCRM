package com.gokul.supportcrm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gokul.supportcrm.entity.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByTicket_TicketIdOrderByCreatedAtAsc(String ticketId);
}