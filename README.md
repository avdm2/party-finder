# PFinder - сервис поиска и размещения мероприятий

## Занятые порты
- 8721 - auth
- 8725 - chat
- 8724 - client-profile
- 8723 - event
- 8722 - organizer-profile

## Создание нового сервиса:
- Обязательно добавить `KafkaConfig`, `SecurityConfig` и `JwtAuthFilter` (файлы лежат в organizer-profile в config)

## Тех стек
1. Бек - Java, Spring
2. Фронт - TS, React, Axios, Leaflet
3. Инфра - Postgres, Redis, Kafka
4. Мониторинг - Prometheus, Grafana, Jaeger (если будем успевать)
5. CI/CD - GitHub Actions, Docker, docker-compose

## Архитектура (модули) бека
`Сто процентов будет чет еще, пока так`
- `analytics - модуль аналитики для оргов
- `auth` - аутентификация + авторизация
    - Проверка логина, пароля, фамилии и имени на фронте
- `chat` - чаты
- `client-profile` - клиентский профиль
- `dating - дейтинг сфера (знакомства)
- `loyalty - лояльность оргов
- `organizer-channels - каналы оргов, мб переедет
- `organizer-profile - профиль оргов
