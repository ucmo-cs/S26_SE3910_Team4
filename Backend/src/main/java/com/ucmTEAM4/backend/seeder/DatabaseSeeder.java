package com.ucmTEAM4.backend.seeder;

import com.ucmTEAM4.backend.entity.Appointment;
import com.ucmTEAM4.backend.entity.Branch;
import com.ucmTEAM4.backend.entity.Topic;
import com.ucmTEAM4.backend.repository.AppointmentRepository;
import com.ucmTEAM4.backend.repository.BranchRepository;
import com.ucmTEAM4.backend.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private final TopicRepository topicRepository;
    private final BranchRepository branchRepository;
    private final AppointmentRepository appointmentRepository;

    public DatabaseSeeder(TopicRepository topicRepository, BranchRepository branchRepository, AppointmentRepository appointmentRepository) {
        this.topicRepository = topicRepository;
        this.branchRepository = branchRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public void run(String... args) {
        // Seed Topics if not already seeded
        if (topicRepository.count() == 0) {
            topicRepository.save(new Topic("t1", "Checking & Savings", "Flexible account options for daily spending and long-term savings goals."));
            topicRepository.save(new Topic("t2", "Credit Cards", "Card services with fraud monitoring, alerts, and account controls."));
            topicRepository.save(new Topic("t3", "Auto Loans", "Competitive financing options for new and used vehicle purchases."));
            topicRepository.save(new Topic("t4", "Home Loans", "Mortgage and refinance support with local lending specialists."));
            topicRepository.save(new Topic("t5", "Small Business", "Business checking, payment tools, and lending support for growth."));
            topicRepository.save(new Topic("t6", "Financial Planning", "Guidance for budgeting, saving, and milestone-based planning."));
        }

        // Seed Branches if not already seeded
        if (branchRepository.count() == 0) {
            branchRepository.save(new Branch("b1", "Plaza Branch", "118 W 47th St", "t1,t2,t4,t6"));
            branchRepository.save(new Branch("b2", "South State Line Branch", "8901 State Line Rd", "t1,t2,t3,t5"));
            branchRepository.save(new Branch("b3", "Downtown Branch", "804 E 12th St", "t1,t2,t4,t6"));
            branchRepository.save(new Branch("b4", "Rosedale Branch", "1906 W 43rd Ave", "t1,t2,t5"));
            branchRepository.save(new Branch("b5", "Brookside Branch", "6336 Brookside Plaza", "t1,t2,t3,t4,t6"));
            branchRepository.save(new Branch("b6", "Leawood Branch", "13441 State Line Rd", "t1,t2,t3,t5,t6"));
        }
    }
}
