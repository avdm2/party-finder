create table event_instance
(
    id          uuid default gen_random_uuid() not null
        primary key,
    owner       uuid                           not null,
    title       varchar                        not null,
    description varchar                        not null
);

CREATE TABLE client.client (
    id uuid default gen_random_uuid() primary key,
    name varchar not null,
    surname varchar not null,
    birth_date date not null
);

CREATE TABLE client.profile (
    id uuid default gen_random_uuid() primary key,
    client_id uuid not null unique references client.client(id) on delete cascade,
    is_confirmed boolean not null,
    created_time timestamp not null,
    updated_time timestamp not null
);