package ru.partyfinder.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.partyfinder.auth.entity.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    @Modifying
    @Query("""
            update User u set
            u.password = CASE WHEN :password IS NOT NULL THEN :password ELSE u.password END,
            u.email = CASE WHEN :email IS NOT NULL THEN :email ELSE u.email END
            where u.username = :username
            """)
    int updateUserCredentials(@Param("username") String username,
                              @Param("password") String password,
                              @Param("email") String email);

}
