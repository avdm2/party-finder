# PFinder - сервис поиска и размещения мероприятий

## Тех стек
1. Бек - Java, Spring
2. Фронт - TS, React, Axios, Leaflet
3. Инфра - Postgres, Redis, Kafka
4. Мониторинг - Prometheus, Grafana, Jaeger (если будем успевать)
5. CI/CD - GitHub Actions, Docker, docker-compose

## Архитектура (модули) бека
`Сто процентов будет чет еще, пока так`
- `analytics - модуль аналитики для оргов
- auth - аутентификация + авторизация
- chat - чаты
- client-profile - клиентский профиль
- `dating - дейтинг сфера (знакомства)
- `event` - все, что связано непосредственно с мероприятиями
- `loyalty - лояльность оргов
- `organizer-channels - каналы оргов, мб переедет
- `organizer-profile - профиль оргов
