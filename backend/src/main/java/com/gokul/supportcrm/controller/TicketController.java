package com.gokul.supportcrm.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

import com.gokul.supportcrm.dto.TicketListResponse;
import com.gokul.supportcrm.dto.CreateTicketResponse;
import com.gokul.supportcrm.dto.CreateTicketRequest;
import com.gokul.supportcrm.dto.TicketDetailResponse;
import com.gokul.supportcrm.dto.UpdateTicketRequest;
import com.gokul.supportcrm.dto.UpdateTicketResponse;
import com.gokul.supportcrm.entity.Ticket;
import com.gokul.supportcrm.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins="https://support-crm-woad.vercel.app")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public CreateTicketResponse createTicket(
            @Valid @RequestBody CreateTicketRequest request) {

        return ticketService.createTicket(request);
    }

    @GetMapping
    public List<TicketListResponse> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        return ticketService.getAllTickets(status, search);
    }

    @GetMapping("/{ticketId}")
public TicketDetailResponse getTicketById(
        @PathVariable String ticketId) {

    return ticketService.getTicketById(ticketId);
}
   @PutMapping("/{ticketId}")
public UpdateTicketResponse updateTicket(
        @PathVariable String ticketId,
        @Valid @RequestBody UpdateTicketRequest request) {

    return ticketService.updateTicket(ticketId, request);
}
}
