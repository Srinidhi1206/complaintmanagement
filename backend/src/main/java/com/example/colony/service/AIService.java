package com.example.colony.service;

import com.example.colony.entity.Complaint;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    public Complaint.Category detectCategory(String title, String description) {
        String content = (title + " " + description).toLowerCase();
        
        if (content.contains("water") || content.contains("leak") || content.contains("pipe")) {
            return Complaint.Category.WATER_ISSUE;
        } else if (content.contains("light") || content.contains("dark") || content.contains("lamp")) {
            return Complaint.Category.STREETLIGHT;
        } else if (content.contains("garbage") || content.contains("waste") || content.contains("trash")) {
            return Complaint.Category.GARBAGE;
        } else if (content.contains("road") || content.contains("hole") || content.contains("pothole")) {
            return Complaint.Category.POTHOLE;
        } else if (content.contains("drain") || content.contains("sewer") || content.contains("overflow")) {
            return Complaint.Category.DRAINAGE;
        }
        
        return Complaint.Category.OTHERS;
    }

    public Complaint.Priority detectPriority(String description) {
        String desc = description.toLowerCase();
        if (desc.contains("danger") || desc.contains("emergency") || desc.contains("dying") || desc.contains("burst")) {
            return Complaint.Priority.URGENT;
        } else if (desc.contains("broken") || desc.contains("immediate") || desc.contains("severely")) {
            return Complaint.Priority.HIGH;
        } else if (desc.contains("bad") || desc.contains("slow")) {
            return Complaint.Priority.MEDIUM;
        }
        return Complaint.Priority.LOW;
    }

    public String analyzeSentiment(String description) {
        String desc = description.toLowerCase();
        if (desc.contains("angry") || desc.contains("furious") || desc.contains("disgusting")) {
            return "Frustrated";
        } else if (desc.contains("please") || desc.contains("help") || desc.contains("request")) {
            return "Neutral/Requesting";
        }
        return "Neutral";
    }

    public Integer detectResolutionDays(Complaint.Category category) {
        if (category == null) return 7;
        switch (category) {
            case POTHOLE: return 14;
            case STREETLIGHT: return 2;
            case DRAINAGE: return 5;
            case WATER_ISSUE: return 1;
            case GARBAGE: return 2;
            default: return 7;
        }
    }
}
