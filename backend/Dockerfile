# Этап 1: Сборка приложения
FROM gradle:7.6-jdk17 AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы Gradle (build.gradle и settings.gradle)
COPY build.gradle settings.gradle ./

# Копируем исходный код
COPY src ./src

# Собираем проект
RUN gradle clean build --no-daemon

# Этап 2: Создание финального образа
FROM openjdk:17-jdk-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем JAR-файл из первого этапа
COPY --from=build /app/build/libs/your-app.jar app.jar

# Команда для запуска приложения
ENTRYPOINT ["java", "-jar", "/app/app.jar"]