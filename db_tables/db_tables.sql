create table client.client
(
    id         uuid default gen_random_uuid() primary key,
    name       varchar not null,
    surname    varchar not null,
    birth_date date    not null
);

create table client.profile
(
    id           uuid default gen_random_uuid() primary key,
    username     varchar(255) unique,
    name         varchar(255) not null,
    surname      varchar(255) not null,
    email        varchar(255) not null,
    birth_date   date         not null,
    media_id   bigint references media(id),
    is_confirmed boolean      not null,
    created_time timestamp    not null,
    updated_time timestamp    not null
);

create table client.media
(
    id         bigserial primary key,
    file_name  text      not null,
    mime_type  text      not null,
    file_data  bytea     not null,
    created_time timestamp default current_timestamp
);

create table auth."user"
(
    id        uuid not null primary key,
    firstname varchar(255),
    lastname  varchar(255),
    password  varchar(255),
    username  varchar(255)
        constraint uksb8bbouer5wak8vyiiy4pf2bx unique,
    email     varchar(255)
);

create table auth.user_roles
(
    user_id uuid not null
        constraint fk55itppkw3i07do3h7qoclqd4k references "user",
    role    varchar(255)
);

create table organizer.organizer
(
    id          uuid default gen_random_uuid() primary key,
    name        varchar not null,
    surname     varchar not null,
    birth_date  date    not null,
    username    varchar not null,
    description varchar
);

create table organizer.event_instance
(
    id              uuid default gen_random_uuid() not null
        primary key,
    owner           uuid                           not null,
    title           varchar                        not null,
    description     varchar                        not null,
    date            timestamp                      not null,
    address         varchar                        not null,
    status          varchar                        not null,
    price           decimal(12, 2),
    capacity        smallint,
    age_restriction smallint
);

create table organizer.rating
(
    id           bigserial
        primary key,
    organizer_id uuid,
    rating       smallint
);


CREATE TABLE organizer.channel (
       id     bigserial primary key,
       uuid   uuid not null,
       name   varchar(255) not null
);

CREATE TABLE organizer.channel_profile (
       id         bigserial primary key,
       channel_id bigint not null references channel (id) on delete cascade,
       client_id  uuid   not null references client.profile (id)
);