package com.icms.repository;

import com.icms.entity.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {

    List<Interaction> findByContactIdOrderByInteractionDateDesc(Long contactId);

    @Query("SELECT i FROM Interaction i ORDER BY i.interactionDate DESC")
    List<Interaction> findRecentInteractions();
}
