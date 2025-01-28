create table event.event_instance
(
    id          uuid default gen_random_uuid() not null
        primary key,
    owner       uuid                           not null,
    title       varchar                        not null,
    description varchar                        not null
);

create table client.client
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL
);

create table client.profile
(
    id           uuid default gen_random_uuid() primary key,
    client_id    uuid      not null unique references client.client (id) on delete cascade,
    is_confirmed boolean   not null,
    created_time timestamp not null,
    updated_time timestamp not null
);

create table auth."user"
(
    id        uuid not null primary key,
    firstname varchar(255),
    lastname  varchar(255),
    password  varchar(255),
    username  varchar(255)
        constraint uksb8bbouer5wak8vyiiy4pf2bx unique
);

create table auth.user_roles
(
    user_id uuid not null
        constraint fk55itppkw3i07do3h7qoclqd4k references "user",
    role    varchar(255)
);

CREATE TABLE organizer.channel (
                         id BIGSERIAL PRIMARY KEY,
                         uuid UUID,
                         name VARCHAR(255)
);

CREATE TABLE organizer.channel_client (
    channel_id BIGINT NOT NULL REFERENCES channel(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES client.client(id) ON DELETE CASCADE,
    PRIMARY KEY (channel_id, client_id)
);