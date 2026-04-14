package com.ucmTEAM4.backend.repository;

import com.ucmTEAM4.backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends JpaRepository<Topic, String> {
}
