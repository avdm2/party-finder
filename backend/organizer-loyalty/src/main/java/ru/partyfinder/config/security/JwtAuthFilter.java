package ru.partyfinder.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

public class JwtAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7);
        String[] parts = token.split("\\.");

        if (parts.length != 3) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid JWT format");
            return;
        }

        String payloadJson = new String(Base64.getDecoder().decode(parts[1]));
        Map<String, Object> payload = new ObjectMapper().readValue(payloadJson, Map.class);

        List<String> roles = (List<String>) payload.getOrDefault("roles", List.of());

        User user = new User(
                (String) payload.get("sub"), "",
                roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).toList()
        );

        PreAuthenticatedAuthenticationToken auth = new PreAuthenticatedAuthenticationToken(user, token, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}


