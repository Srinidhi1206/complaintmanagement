package com.example.colony.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Category category;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "complaint_images", joinColumns = @JoinColumn(name = "complaint_id"))
    @Column(name = "image_data", columnDefinition = "CLOB")
    private List<String> images = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private String sentiment; 

    private Double latitude;
    private Double longitude;
    private String address;

    private Integer upvotes = 0;
    private Integer estimatedResolutionDays;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum Category {
        POTHOLE, DRAINAGE, STREETLIGHT, GARBAGE, WATER_ISSUE, OTHERS
    }

    public enum Status {
        PENDING, IN_PROGRESS, RESOLVED
    }

    public Complaint() {}

    public Complaint(Long id, String title, String description, Category category, List<String> images, Status status, Priority priority, String sentiment, Double latitude, Double longitude, String address, Integer upvotes, Integer estimatedResolutionDays, User user) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.images = images != null ? images : new ArrayList<>();
        this.status = status != null ? status : Status.PENDING;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.sentiment = sentiment;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.upvotes = upvotes != null ? upvotes : 0;
        this.estimatedResolutionDays = estimatedResolutionDays;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }
    public Integer getEstimatedResolutionDays() { return estimatedResolutionDays; }
    public void setEstimatedResolutionDays(Integer estimatedResolutionDays) { this.estimatedResolutionDays = estimatedResolutionDays; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static ComplaintBuilder builder() {
        return new ComplaintBuilder();
    }

    public static class ComplaintBuilder {
        private Long id;
        private String title;
        private String description;
        private Category category;
        private List<String> images;
        private Status status;
        private Priority priority;
        private String sentiment;
        private Double latitude;
        private Double longitude;
        private String address;
        private Integer upvotes;
        private Integer estimatedResolutionDays;
        private User user;

        public ComplaintBuilder id(Long id) { this.id = id; return this; }
        public ComplaintBuilder title(String title) { this.title = title; return this; }
        public ComplaintBuilder description(String description) { this.description = description; return this; }
        public ComplaintBuilder category(Category category) { this.category = category; return this; }
        public ComplaintBuilder images(List<String> images) { this.images = images; return this; }
        public ComplaintBuilder status(Status status) { this.status = status; return this; }
        public ComplaintBuilder priority(Priority priority) { this.priority = priority; return this; }
        public ComplaintBuilder sentiment(String sentiment) { this.sentiment = sentiment; return this; }
        public ComplaintBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ComplaintBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public ComplaintBuilder address(String address) { this.address = address; return this; }
        public ComplaintBuilder upvotes(Integer upvotes) { this.upvotes = upvotes; return this; }
        public ComplaintBuilder estimatedResolutionDays(Integer estimatedResolutionDays) { this.estimatedResolutionDays = estimatedResolutionDays; return this; }
        public ComplaintBuilder user(User user) { this.user = user; return this; }

        public Complaint build() {
            return new Complaint(id, title, description, category, images, status, priority, sentiment, latitude, longitude, address, upvotes, estimatedResolutionDays, user);
        }
    }
}
