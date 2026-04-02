package com.example.colony.controller;

import com.example.colony.entity.User;
import com.example.colony.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        String phoneNumber = (String) payload.get("phoneNumber");
        String area = (String) payload.get("area");
        User.Role role = User.Role.valueOf((String) payload.get("role"));
        Double lat = payload.containsKey("latitude") ? Double.valueOf(payload.get("latitude").toString()) : null;
        Double lng = payload.containsKey("longitude") ? Double.valueOf(payload.get("longitude").toString()) : null;
        Double radius = payload.containsKey("geofenceRadiusKm") ? Double.valueOf(payload.get("geofenceRadiusKm").toString()) : 5.0;
        
        return authService.register(name, phoneNumber, area, role, lat, lng, radius);
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> payload) {
        String phoneNumber = payload.get("phoneNumber");
        return authService.login(phoneNumber);
    }
}
