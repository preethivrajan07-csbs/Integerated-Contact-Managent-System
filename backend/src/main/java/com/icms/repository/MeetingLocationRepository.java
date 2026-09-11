package com.icms.repository;

import com.icms.entity.MeetingLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingLocationRepository extends JpaRepository<MeetingLocation, Long> {
    List<MeetingLocation> findByContactId(Long contactId);
}
