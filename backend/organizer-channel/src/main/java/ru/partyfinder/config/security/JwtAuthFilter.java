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
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

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
        String authHeader = request.getHeader("Authorization");

        log.info("Handling request: " + request.getRequestURI());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Разрешаем запросы OPTIONS без токена
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                filterChain.doFilter(request, response);
                return;
            }

            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Missing or invalid Authorization header");
            return;
        }
        try {
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
            UserRequest userRequest = userContextFillingService.fillUserRequest((String) payload.get("sub"));
            UserContextHolder.setContext(userRequest);
            PreAuthenticatedAuthenticationToken auth = new PreAuthenticatedAuthenticationToken(userRequest, userRequest, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Передаем запрос дальше по цепочке фильтров
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            // Логируем ошибку, но не отправляем 401, если запрос уже начал обрабатываться
            log.error("Ошибка при проверке токена: " + e.getMessage());
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Ошибка аутентификации");
        }
    }
}


