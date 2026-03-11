package com.decorhub.decorhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.decorhub.decorhub.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

}

