package ru.partyfinder.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserContextFillingService userContextFillingService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (request.getRequestURI().contains("/ws") ) {
            filterChain.doFilter(request, response);

        } else {
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.sendError(HttpStatus.UNAUTHORIZED.value(), "Missing or invalid Authorization header");
                return;
            }

            String token = authHeader.substring(7);
            if (!token.equals("SYSTEM_USER")) {
                String[] parts = token.split("\\.");

                if (parts.length != 3) {
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid JWT format");
                    return;
                }

                String payloadJson = new String(Base64.getDecoder().decode(parts[1]));
                Map<String, Object> payload = new ObjectMapper().readValue(payloadJson, Map.class);

                List<String> roles = (List<String>) payload.getOrDefault("roles", List.of());

                log.info("USERNAME -> " + payload.get("sub"));

                User user = new User(
                        (String) payload.get("sub"), "",
                        roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).toList()
                );
                UserRequest userRequest = userContextFillingService.fillUserRequest((String) payload.get("sub"));
                UserContextHolder.setContext(userRequest);
                log.info(user.getAuthorities().toString());
                PreAuthenticatedAuthenticationToken auth = new PreAuthenticatedAuthenticationToken(userRequest, userRequest, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);

                filterChain.doFilter(request, response);
            } else {



                User user = new User(
                        "SYSTEM_USER", "",
                        List.of(new SimpleGrantedAuthority("ROLE_" + "PARTICIPANT"))
                );
                UserRequest userRequest = userContextFillingService.fillUserRequest("SYSTEM_USER");
                UserContextHolder.setContext(userRequest);
                log.info(user.getAuthorities().toString());
                PreAuthenticatedAuthenticationToken auth = new PreAuthenticatedAuthenticationToken(userRequest, userRequest, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);

                filterChain.doFilter(request, response);
            }
        }
    }
}


