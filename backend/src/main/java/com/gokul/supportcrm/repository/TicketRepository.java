package com.gokul.supportcrm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gokul.supportcrm.entity.Ticket;
import com.gokul.supportcrm.enums.TicketStatus;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByTicketId(String ticketId);

    @Query("""
        SELECT t FROM Ticket t
        WHERE (:status IS NULL OR t.status = :status)
        AND (
            :search IS NULL
            OR LOWER(t.ticketId) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.customerEmail) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        ORDER BY t.createdAt DESC
        """)
    List<Ticket> searchTickets(
            @Param("status") TicketStatus status,
            @Param("search") String search
    );
}