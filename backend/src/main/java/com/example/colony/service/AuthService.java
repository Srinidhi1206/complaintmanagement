package com.example.colony.service;

import com.example.colony.entity.User;
import com.example.colony.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(String name, String phoneNumber, String area, User.Role role, 
                        Double lat, Double lng, Double radius) {
        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            throw new RuntimeException("User already exists with phone number: " + phoneNumber);
        }

        User user = User.builder()
                .name(name)
                .phoneNumber(phoneNumber)
                .area(area)
                .role(role)
                .latitude(lat)
                .longitude(lng)
                .geofenceRadiusKm(radius)
                .build();

        return userRepository.save(user);
    }

    public User login(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
