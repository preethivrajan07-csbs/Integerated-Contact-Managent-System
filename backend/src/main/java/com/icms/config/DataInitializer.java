package com.icms.config;

import com.icms.entity.*;
import com.icms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;
    private final EventRepository eventRepository;
    private final MeetingLocationRepository meetingLocationRepository;
    private final InteractionRepository interactionRepository;
    private final NotificationRepository notificationRepository;

    public DataInitializer(ContactRepository contactRepository,
                           EventRepository eventRepository,
                           MeetingLocationRepository meetingLocationRepository,
                           InteractionRepository interactionRepository,
                           NotificationRepository notificationRepository) {
        this.contactRepository = contactRepository;
        this.eventRepository = eventRepository;
        this.meetingLocationRepository = meetingLocationRepository;
        this.interactionRepository = interactionRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (contactRepository.count() > 0) {
            return; // Seed data already initialized
        }

        // 1. Create Contacts across Chennai, Vellore, Krishnagiri, Ambur, Vaniyambadi
        Contact ravi = new Contact("Ravi Kumar", "+91 9876543210", "ravi@gmail.com", Category.COLLEGE, "Anna Nagar, Chennai");
        ravi.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        ravi.setNotes("Met at college hackathon 2026. Full-stack developer proficient in React and Java.");
        ravi.setRelationshipScore(85);
        ravi.setHomeLatitude(13.0850);
        ravi.setHomeLongitude(80.2100);
        ravi.setHomeCityArea("Chennai Anna Nagar");
        ravi.setPrivacyLevel(PrivacyLevel.APPROXIMATE);
        ravi.setAllowNearbyDiscovery(true);

        Contact arun = new Contact("Arun Prakash", "+91 9812345678", "arun.tech@gmail.com", Category.PROFESSIONAL, "T-Nagar, Chennai");
        arun.setAvatarUrl("https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150");
        arun.setNotes("Lead architect at Tech Solutions. Met during Java Developer Workshop.");
        arun.setRelationshipScore(78);
        arun.setHomeLatitude(13.0418);
        arun.setHomeLongitude(80.2341);
        arun.setHomeCityArea("T-Nagar Tech Hub");
        arun.setPrivacyLevel(PrivacyLevel.APPROXIMATE);
        arun.setAllowNearbyDiscovery(true);

        Contact priya = new Contact("Priya Sharma", "+91 9765432109", "priya.design@outlook.com", Category.FRIEND, "Adyar, Chennai");
        priya.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");
        priya.setNotes("UI/UX designer. Attended AI Hackathon and UI Summit together.");
        priya.setRelationshipScore(92);
        priya.setHomeLatitude(13.0067);
        priya.setHomeLongitude(80.2571);
        priya.setHomeCityArea("Adyar Area");
        priya.setPrivacyLevel(PrivacyLevel.APPROXIMATE);
        priya.setAllowNearbyDiscovery(true);

        Contact suresh = new Contact("Suresh Babu", "+91 9443211223", "suresh.vellore@gmail.com", Category.PROFESSIONAL, "Katpadi Road, Vellore");
        suresh.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
        suresh.setNotes("Senior Systems Engineer in Vellore.");
        suresh.setRelationshipScore(82);
        suresh.setHomeLatitude(12.9165);
        suresh.setHomeLongitude(79.1325);
        suresh.setHomeCityArea("Vellore Fort Region");
        suresh.setPrivacyLevel(PrivacyLevel.APPROXIMATE);
        suresh.setAllowNearbyDiscovery(true);

        Contact kavitha = new Contact("Kavitha Reddy", "+91 9789012345", "kavitha.krishnagiri@org.in", Category.OFFICE, "Rayakottai Road, Krishnagiri");
        kavitha.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        kavitha.setNotes("Regional Operations Manager in Krishnagiri.");
        kavitha.setRelationshipScore(76);
        kavitha.setHomeLatitude(12.5266);
        kavitha.setHomeLongitude(78.2146);
        kavitha.setHomeCityArea("Krishnagiri Region");
        kavitha.setPrivacyLevel(PrivacyLevel.APPROXIMATE);
        kavitha.setAllowNearbyDiscovery(true);

        Contact tariq = new Contact("Tariq Ahmed", "+91 9940123456", "tariq.ambur@leathertech.com", Category.FRIEND, "MC Road, Ambur");
        tariq.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150");
        tariq.setNotes("Software Consultant in Ambur.");
        tariq.setRelationshipScore(80);
        tariq.setHomeLatitude(12.7909);
        tariq.setHomeLongitude(78.7166);
        tariq.setHomeCityArea("Ambur Region");
        tariq.setPrivacyLevel(PrivacyLevel.APPROXIMATE);
        tariq.setAllowNearbyDiscovery(true);

        Contact imran = new Contact("Imran Khan", "+91 9894123890", "imran.vmb@gmail.com", Category.COLLEGE, "Khaderpet, Vaniyambadi");
        imran.setAvatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150");
        imran.setNotes("Mobile app developer in Vaniyambadi.");
        imran.setRelationshipScore(84);
        imran.setHomeLatitude(12.6825);
        imran.setHomeLongitude(78.6186);
        imran.setHomeCityArea("Vaniyambadi Region");
        imran.setPrivacyLevel(PrivacyLevel.APPROXIMATE);
        imran.setAllowNearbyDiscovery(true);

        Contact karthik = new Contact("Dr. Karthik Sundaram", "+91 9444012345", "dr.karthik@cityhospital.org", Category.DOCTOR, "Nungambakkam, Chennai");
        karthik.setAvatarUrl("https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150");
        karthik.setNotes("Family physician at City Medical Center.");
        karthik.setRelationshipScore(60);
        karthik.setHomeLatitude(13.0604);
        karthik.setHomeLongitude(80.2496);
        karthik.setHomeCityArea("Nungambakkam Area");
        karthik.setPrivacyLevel(PrivacyLevel.PRIVATE);
        karthik.setAllowNearbyDiscovery(false);

        contactRepository.saveAll(List.of(ravi, arun, priya, suresh, kavitha, tariq, imran, karthik));

        // 2. Create Events & Assign Participants
        Event aiHackathon = new Event(
            "AI Hackathon 2026",
            "48-hour generative AI innovation event focused on smart city solutions.",
            LocalDate.of(2026, 8, 15),
            LocalTime.of(9, 0),
            "IIT Madras Research Park",
            12.9915,
            80.2425,
            "Hackathon"
        );
        aiHackathon.setParticipants(List.of(ravi, arun, priya));

        Event velloreEvent = new Event(
            "Vellore Tech Meetup 2026",
            "Regional developer meet on Cloud & Distributed Systems.",
            LocalDate.of(2026, 6, 18),
            LocalTime.of(10, 0),
            "VIT University Campus, Vellore",
            12.9692,
            79.1559,
            "Conference"
        );
        velloreEvent.setParticipants(List.of(suresh));

        Event techConf = new Event(
            "Chennai Tech Conference 2026",
            "Annual developer conference on Cloud Native, Spring Boot, and Web Frameworks.",
            LocalDate.of(2026, 8, 10),
            LocalTime.of(10, 0),
            "Chennai Trade Centre",
            13.0182,
            80.1942,
            "Conference"
        );
        techConf.setParticipants(List.of(ravi, priya));

        eventRepository.saveAll(List.of(aiHackathon, velloreEvent, techConf));

        // 3. Create Meeting Locations
        MeetingLocation m1 = new MeetingLocation("Chennai Trade Centre", "Nandambakkam, Chennai", 13.0182, 80.1942, LocalDate.of(2026, 8, 10), "Initial meeting during keynote session", "Chennai Tech Conference 2026", ravi);
        MeetingLocation m2 = new MeetingLocation("VIT Campus, Vellore", "Katpadi, Vellore", 12.9692, 79.1559, LocalDate.of(2026, 6, 18), "Met at VIT Vellore campus", "Vellore Tech Meetup", suresh);
        MeetingLocation m3 = new MeetingLocation("Ambur Convention Hall", "MC Road, Ambur", 12.7909, 78.7166, LocalDate.of(2026, 7, 4), "Tech workshop session", null, tariq);
        MeetingLocation m4 = new MeetingLocation("Islamiah College Campus", "Vaniyambadi", 12.6825, 78.6186, LocalDate.of(2026, 6, 25), "Alumni meetup", null, imran);

        meetingLocationRepository.saveAll(List.of(m1, m2, m3, m4));

        // 4. Create Interactions
        Interaction i1 = new Interaction(InteractionType.MEETING, LocalDateTime.of(2026, 8, 10, 11, 30), "Met at Chennai Tech Conference.", "Chennai Trade Centre", "Chennai Tech Conference 2026", ravi);
        Interaction i2 = new Interaction(InteractionType.MEETING, LocalDateTime.of(2026, 6, 18, 14, 0), "Met at VIT Vellore campus for project collaboration.", "VIT Vellore", "Vellore Tech Meetup", suresh);

        interactionRepository.saveAll(List.of(i1, i2));

        // 5. Create Seed Notifications
        Notification n1 = new Notification("Upcoming Event: AI Hackathon 2026", "AI Hackathon starts in 6 days at IIT Madras Research Park.", NotificationType.EVENT_REMINDER);
        Notification n2 = new Notification("Privacy Notice Enabled", "Approximate home location privacy active for regional contacts in Vellore, Krishnagiri, Ambur, Vaniyambadi & Chennai.", NotificationType.PRIVACY_ALERT);

        notificationRepository.saveAll(List.of(n1, n2));
    }
}
