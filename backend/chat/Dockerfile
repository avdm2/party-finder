FROM eclipse-temurin:17-jdk
COPY build/libs/chat-1.0.0.jar app.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-jar", "/app.jar"]