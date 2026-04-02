package com.example.colony.repository;

import com.example.colony.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    @Query("SELECT c FROM Complaint c WHERE " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(c.latitude)) * " +
           "cos(radians(c.longitude) - radians(:lng)) + " +
           "sin(radians(:lat)) * sin(radians(c.latitude)))) <= :radius")
    List<Complaint> findNearby(@Param("lat") Double lat, 
                              @Param("lng") Double lng, 
                              @Param("radius") Double radius);

    List<Complaint> findByUserId(Long userId);
    
    List<Complaint> findAllByOrderByUpvotesDescCreatedAtDesc();
}
