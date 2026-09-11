package com.icms.repository;

import com.icms.entity.Category;
import com.icms.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    Optional<Contact> findByPhoneNumber(String phoneNumber);

    Optional<Contact> findByEmail(String email);

    List<Contact> findByCategory(Category category);

    @Query("SELECT c FROM Contact c WHERE " +
           "LOWER(c.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.notes) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Contact> searchContacts(@Param("query") String query);

    @Query("SELECT c FROM Contact c WHERE c.phoneNumber = :phone OR c.email = :email")
    List<Contact> findDuplicates(@Param("phone") String phone, @Param("email") String email);
}
