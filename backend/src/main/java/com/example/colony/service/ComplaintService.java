package com.example.colony.service;

import com.example.colony.entity.Complaint;
import com.example.colony.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private AIService aiService;

    public Complaint createComplaint(Complaint complaint) {
        // AI - Auto Detection
        if (complaint.getCategory() == null || complaint.getCategory() == Complaint.Category.OTHERS) {
            complaint.setCategory(aiService.detectCategory(complaint.getTitle(), complaint.getDescription()));
        }
        complaint.setPriority(aiService.detectPriority(complaint.getDescription()));
        complaint.setSentiment(aiService.analyzeSentiment(complaint.getDescription()));
        complaint.setEstimatedResolutionDays(aiService.detectResolutionDays(complaint.getCategory()));

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getNearbyComplaints(Double lat, Double lng, Double radius) {
        return complaintRepository.findNearby(lat, lng, radius);
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    public List<Complaint> getDuplicateSuggestions(Double lat, Double lng, String title) {
        // High-level duplicate check: same area (500m) and similar title
        List<Complaint> nearby = complaintRepository.findNearby(lat, lng, 0.5);
        return nearby.stream()
                .filter(c -> c.getTitle().toLowerCase().contains(title.toLowerCase().split(" ")[0]))
                .toList();
    }

    public Complaint updateStatus(Long complaintId, Complaint.Status status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }

    public Complaint upvote(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setUpvotes(complaint.getUpvotes() + 1);
        return complaintRepository.save(complaint);
    }

    public Complaint getComplaint(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }
}
