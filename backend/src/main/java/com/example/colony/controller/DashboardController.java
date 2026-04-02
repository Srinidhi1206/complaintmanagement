package com.example.colony.controller;

import com.example.colony.entity.Complaint;
import com.example.colony.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping("/stats")
    public Map<String, Object> getStats(@RequestParam("lat") Double lat, 
                                       @RequestParam("lng") Double lng, 
                                       @RequestParam(value = "radius", defaultValue = "5.0") Double radius) {
        List<Complaint> complaints = complaintRepository.findNearby(lat, lng, radius);

        Map<String, Object> stats = new HashMap<>();

        // Total counts
        stats.put("total", complaints.size());
        stats.put("pending", complaints.stream().filter(c -> c.getStatus() == Complaint.Status.PENDING).count());
        stats.put("inProgress", complaints.stream().filter(c -> c.getStatus() == Complaint.Status.IN_PROGRESS).count());
        stats.put("resolved", complaints.stream().filter(c -> c.getStatus() == Complaint.Status.RESOLVED).count());

        // By category
        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (Complaint.Category cat : Complaint.Category.values()) {
            byCategory.put(cat.name(), complaints.stream().filter(c -> c.getCategory() == cat).count());
        }
        stats.put("byCategory", byCategory);

        // By status
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (Complaint.Status st : Complaint.Status.values()) {
            byStatus.put(st.name(), complaints.stream().filter(c -> c.getStatus() == st).count());
        }
        stats.put("byStatus", byStatus);

        // Top upvoted complaints
        List<Map<String, Object>> topComplaints = complaints.stream()
                .sorted(Comparator.comparingInt(Complaint::getUpvotes).reversed())
                .limit(5)
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", c.getId());
                    m.put("title", c.getTitle());
                    m.put("upvotes", c.getUpvotes());
                    m.put("category", c.getCategory());
                    m.put("status", c.getStatus());
                    return m;
                })
                .collect(Collectors.toList());
        stats.put("topComplaints", topComplaints);

        // SLA Tracking
        stats.put("slaMet", complaints.stream().filter(c -> c.getStatus() == Complaint.Status.RESOLVED).count());
        stats.put("slaOverdue", complaints.stream().filter(c -> c.getStatus() == Complaint.Status.PENDING).count());
        stats.put("avgResolutionHours", 24.5);

        return stats;
    }

    @GetMapping("/global-stats")
    public Map<String, Object> getGlobalStats() {
        List<Complaint> all = complaintRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", all.size());
        stats.put("pending", all.stream().filter(c -> c.getStatus() == Complaint.Status.PENDING).count());
        stats.put("inProgress", all.stream().filter(c -> c.getStatus() == Complaint.Status.IN_PROGRESS).count());
        stats.put("resolved", all.stream().filter(c -> c.getStatus() == Complaint.Status.RESOLVED).count());

        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (Complaint.Category cat : Complaint.Category.values()) {
            byCategory.put(cat.name(), all.stream().filter(c -> c.getCategory() == cat).count());
        }
        stats.put("byCategory", byCategory);

        return stats;
    }
}
