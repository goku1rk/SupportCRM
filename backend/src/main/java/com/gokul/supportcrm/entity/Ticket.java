package com.gokul.supportcrm.entity;

import jakarta.persistence.*;
import com.gokul.supportcrm.enums.TicketStatus;
import java.time.LocalDateTime;

@Entity 
@Table(name="tickets")

public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", unique= true, nullable=false)
    private String ticketId;

    @Column(name="customer_name", nullable=false)
    private String customerName;

    @Column(name="customer_email", nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(name= "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name= "updated_at")
    private LocalDateTime updatedAt;

@PrePersist 
public void prePersist(){
    createdAt=LocalDateTime.now();
    updatedAt=LocalDateTime.now();
    }

@PreUpdate 
public void preUpdate(){
    updatedAt=LocalDateTime.now();
    }

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }
    public String getTicketId(){
        return ticketId;
    }
    public void setTicketId(String ticketId){
        this.ticketId=ticketId;
    }
    public String getCustomerName(){
        return customerName;
    }
    public void setCustomerName(String customerName){
        this.customerName=customerName;
    }
    public String getCustomerEmail(){
        return customerEmail;
    }
    public void setCustomerEmail(String customerEmail){
        this.customerEmail=customerEmail;
    }
    public String getSubject(){
        return subject;
    }
    public void setSubject(String subject){
        this.subject=subject;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description=description;
    }
    public TicketStatus getTicketStatus(){
        return status;
    }
    public void setTicketStatus(TicketStatus status){
        this.status=status;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }  
    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt=createdAt;
    }
    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt){
        this.updatedAt=updatedAt;
    }
}
