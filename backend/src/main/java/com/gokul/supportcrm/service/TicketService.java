package com.gokul.supportcrm.service;

import java.util.List;

import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

import com.gokul.supportcrm.dto.NoteResponse;
import com.gokul.supportcrm.dto.UpdateTicketResponse;
import com.gokul.supportcrm.dto.CreateTicketResponse;
import com.gokul.supportcrm.dto.TicketListResponse;
import com.gokul.supportcrm.dto.TicketDetailResponse;
import com.gokul.supportcrm.dto.CreateTicketRequest;
import com.gokul.supportcrm.dto.UpdateTicketRequest;
import com.gokul.supportcrm.entity.Note;
import com.gokul.supportcrm.entity.Ticket;
import com.gokul.supportcrm.enums.TicketStatus;
import com.gokul.supportcrm.exception.ResourceNotFoundException;
import com.gokul.supportcrm.repository.NoteRepository;
import com.gokul.supportcrm.repository.TicketRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final NoteRepository noteRepository;

    public TicketService(
            TicketRepository ticketRepository,
            NoteRepository noteRepository) {

        this.ticketRepository = ticketRepository;
        this.noteRepository = noteRepository;
    }

    public CreateTicketResponse createTicket(CreateTicketRequest request) {

    Ticket ticket = new Ticket();

    ticket.setTicketId("TKT-" + System.currentTimeMillis());
    ticket.setCustomerName(request.getCustomerName());
    ticket.setCustomerEmail(request.getCustomerEmail());
    ticket.setSubject(request.getSubject());
    ticket.setDescription(request.getDescription());
    ticket.setTicketStatus(TicketStatus.OPEN);

    Ticket savedTicket = ticketRepository.save(ticket);

    return new CreateTicketResponse(
            savedTicket.getTicketId(),
            savedTicket.getCreatedAt()
    );
}

    public List<TicketListResponse> getAllTickets(
        String status,
        String search) {

    TicketStatus ticketStatus = null;

    if (status != null && !status.isBlank()) {

        try {
            ticketStatus = parseStatus(status);

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                "Invalid status value: " + status
            );
        }
    }

    if (search != null && search.isBlank()) {
        search = null;
    }

    List<Ticket> tickets =
            ticketRepository.searchTickets(ticketStatus, search);

    return tickets.stream()
            .map(ticket -> new TicketListResponse(
                    ticket.getTicketId(),
                    ticket.getCustomerName(),
                    ticket.getSubject(),
                    formatStatus(ticket.getTicketStatus()),
                    ticket.getCreatedAt()
            ))
            .collect(Collectors.toList());
}

    public TicketDetailResponse getTicketById(String ticketId) {

    Ticket ticket = ticketRepository.findByTicketId(ticketId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Ticket not found with ID: " + ticketId
                )
            );

    List<NoteResponse> notes = noteRepository
            .findByTicket_TicketIdOrderByCreatedAtAsc(ticketId)
            .stream()
            .map(note -> new NoteResponse(
                    note.getNoteText(),
                    note.getCreatedAt()
            ))
            .collect(Collectors.toList());

    return new TicketDetailResponse(
            ticket.getTicketId(),
            ticket.getCustomerName(),
            ticket.getCustomerEmail(),
            ticket.getSubject(),
            ticket.getDescription(),
            formatStatus(ticket.getTicketStatus()),
            notes
    );
}
private String formatStatus(TicketStatus status) {

    if (status == null) {
        return null;
    }

    return switch (status) {
        case OPEN -> "Open";
        case IN_PROGRESS -> "In Progress";
        case CLOSED -> "Closed";
    };
}

    public UpdateTicketResponse updateTicket(
        String ticketId,
        UpdateTicketRequest request) {

    Ticket ticket = ticketRepository.findByTicketId(ticketId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Ticket not found with ID: " + ticketId
                )
            );

    // Update status
    if (request.getStatus() != null
            && !request.getStatus().isBlank()) {

        TicketStatus status = parseStatus(request.getStatus());

        ticket.setTicketStatus(status);
    }

    Ticket updatedTicket = ticketRepository.save(ticket);

    // Add note if provided
    if (request.getNotes() != null
            && !request.getNotes().isBlank()) {

        Note note = new Note();

        note.setTicket(updatedTicket);
        note.setNoteText(request.getNotes());

        noteRepository.save(note);
    }

    return new UpdateTicketResponse(
            true,
            updatedTicket.getUpdatedAt()
    );
}
    private TicketStatus parseStatus(String status) {

        String normalizedStatus = status
                .trim()
                .toUpperCase()
                .replace(" ", "_");

        return TicketStatus.valueOf(normalizedStatus);
    }
}