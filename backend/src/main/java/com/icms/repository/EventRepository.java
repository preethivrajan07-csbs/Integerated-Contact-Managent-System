package com.icms.repository;

import com.icms.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.id = :contactId")
    List<Event> findEventsByContactId(@Param("contactId") Long contactId);

    List<Event> findByCategory(String category);
}
