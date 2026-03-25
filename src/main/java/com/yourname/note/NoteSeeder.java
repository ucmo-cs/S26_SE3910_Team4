package com.yourname.note;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class NoteSeeder implements CommandLineRunner {
    private final NoteRepository repository;

    public NoteSeeder(NoteRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.save(new Note(null, "First note"));
        }
    }
}
