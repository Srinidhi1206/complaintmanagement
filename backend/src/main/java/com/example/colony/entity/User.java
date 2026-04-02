package com.example.colony.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phoneNumber;
    private String area;

    private Double latitude;
    private Double longitude;
    private Double geofenceRadiusKm; 

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        USER, ADMIN, SUPER_ADMIN
    }

    public User() {}

    public User(Long id, String name, String phoneNumber, String area, Double latitude, Double longitude, Double geofenceRadiusKm, Role role) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.area = area;
        this.latitude = latitude;
        this.longitude = longitude;
        this.geofenceRadiusKm = geofenceRadiusKm;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getGeofenceRadiusKm() { return geofenceRadiusKm; }
    public void setGeofenceRadiusKm(Double geofenceRadiusKm) { this.geofenceRadiusKm = geofenceRadiusKm; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    // Manual Builder
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String phoneNumber;
        private String area;
        private Double latitude;
        private Double longitude;
        private Double geofenceRadiusKm;
        private Role role;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public UserBuilder area(String area) { this.area = area; return this; }
        public UserBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public UserBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public UserBuilder geofenceRadiusKm(Double geofenceRadiusKm) { this.geofenceRadiusKm = geofenceRadiusKm; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }

        public User build() {
            return new User(id, name, phoneNumber, area, latitude, longitude, geofenceRadiusKm, role);
        }
    }
}
