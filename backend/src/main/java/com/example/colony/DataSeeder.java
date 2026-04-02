package com.example.colony;

import com.example.colony.entity.Complaint;
import com.example.colony.entity.User;
import com.example.colony.repository.ComplaintRepository;
import com.example.colony.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initData(UserRepository userRepository, ComplaintRepository complaintRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                // Admins
                userRepository.save(User.builder()
                        .name("Super Admin")
                        .phoneNumber("9999999999")
                        .role(User.Role.SUPER_ADMIN)
                        .area("City Center")
                        .latitude(12.9716)
                        .longitude(77.5946)
                        .build());

                userRepository.save(User.builder()
                        .name("West Zone Admin")
                        .phoneNumber("8888888888")
                        .role(User.Role.ADMIN)
                        .area("West Zone")
                        .latitude(12.9616)
                        .longitude(77.5846)
                        .geofenceRadiusKm(5.0)
                        .build());

                // Users
                User resident = userRepository.save(User.builder()
                        .name("John Resident")
                        .phoneNumber("7777777777")
                        .role(User.Role.USER)
                        .area("Green Valley")
                        .latitude(12.9716)
                        .longitude(77.5946)
                        .build());

                // Complaints
                complaintRepository.save(Complaint.builder()
                        .title("Main Road Pothole")
                        .description("Large pothole causing traffic near the main junction.")
                        .category(Complaint.Category.POTHOLE)
                        .status(Complaint.Status.PENDING)
                        .priority(Complaint.Priority.HIGH)
                        .latitude(12.9720)
                        .longitude(77.5950)
                        .address("Junction 4, Main Road")
                        .user(resident)
                        .build());

                complaintRepository.save(Complaint.builder()
                        .title("Streetlight Out")
                        .description("Entire street is dark at night, unsafe for women and children.")
                        .category(Complaint.Category.STREETLIGHT)
                        .status(Complaint.Status.PENDING)
                        .priority(Complaint.Priority.MEDIUM)
                        .latitude(12.9710)
                        .longitude(77.5940)
                        .address("Lane 2, Green Valley")
                        .user(resident)
                        .build());
            }
        };
    }
}
