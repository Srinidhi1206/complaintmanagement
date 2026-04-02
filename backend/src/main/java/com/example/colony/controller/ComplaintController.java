package com.example.colony.controller;

import com.example.colony.entity.Complaint;
import com.example.colony.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        return complaintService.createComplaint(complaint);
    }

    @GetMapping("/nearby")
    public List<Complaint> getNearbyComplaints(@RequestParam("lat") Double lat, 
                                             @RequestParam("lng") Double lng, 
                                             @RequestParam(value = "radius", defaultValue = "5.0") Double radius) {
        return complaintService.getNearbyComplaints(lat, lng, radius);
    }

    @GetMapping("/duplicates")
    public List<Complaint> getDuplicates(@RequestParam("lat") Double lat, 
                                        @RequestParam("lng") Double lng, 
                                        @RequestParam("title") String title) {
        return complaintService.getDuplicateSuggestions(lat, lng, title);
    }

    @GetMapping("/user/{userId}")
    public List<Complaint> getUserComplaints(@PathVariable("userId") Long userId) {
        return complaintService.getComplaintsByUser(userId);
    }

    @PutMapping("/{id}/status")
    public Complaint updateStatus(@PathVariable("id") Long id, @RequestParam("status") Complaint.Status status) {
        return complaintService.updateStatus(id, status);
    }

    @PostMapping("/{id}/upvote")
    public Complaint upvote(@PathVariable("id") Long id) {
        return complaintService.upvote(id);
    }

    @GetMapping("/{id}")
    public Complaint getComplaint(@PathVariable("id") Long id) {
        return complaintService.getComplaint(id);
    }
}
