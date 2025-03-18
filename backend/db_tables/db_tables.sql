create table client.profile
(
    id           uuid                   default gen_random_uuid() primary key,
    username     varchar(255) unique,
    name         varchar(255)  not null,
    surname      varchar(255)  not null,
    email        varchar(255)  not null,
    birth_date   date          not null,
    media_id     bigint references media (id),
    rating       decimal(3, 2) not null default 0.00,
    is_confirmed boolean       not null,
    created_time timestamp     not null,
    updated_time timestamp     not null
);

create table source.new_ratings
(
    id           bigserial primary key,
    entity_type  text          not null check (entity_type in ('PROFILE', 'ORGANIZER', 'EVENT')),
    entity_id    uuid          not null,
    score        decimal(3, 2) not null check (score between 0.00 and 5.00),
    created_time timestamp     not null default current_timestamp,
    processed    boolean       not null default false
);

create table source.rating
(
    id           bigserial primary key,
    entity_type  text          not null check (entity_type in ('PROFILE', 'ORGANIZER', 'EVENT')),
    entity_id    uuid          not null,
    score        decimal(3, 2) not null check (score between 0.00 and 5.00),
    created_time timestamp     not null default current_timestamp
);

create table client.media
(
    id           bigserial primary key,
    file_name    text  not null,
    mime_type    text  not null,
    file_data    bytea not null,
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
    media_id    bigint references organizer.media (id),
    description varchar
);

create table organizer.event_instance
(
    id              uuid default gen_random_uuid() not null
        primary key,
    organizer_id           uuid                           not null,
    title           varchar                        not null,
    description     varchar                        not null,
    date            timestamp                      not null,
    address         varchar                        not null,
    status          varchar                        not null,
    price           decimal(12, 2),
    capacity        smallint,
    age_restriction smallint
);

create table organizer.event_client
(
    id              uuid default gen_random_uuid() not null
        primary key,
    eventId           uuid                           not null,
    username          varchar                        not null,
    createdTime     timestamp default current_timestamp
);



create table organizer.rating
(
    id           bigserial
        primary key,
    organizer_id uuid,
    rating       smallint
);

CREATE TABLE organizer.channel
(
    id   bigserial primary key,
    uuid uuid         not null,
    name varchar(255) not null
);

CREATE TABLE organizer.channel_profile
(
    id         bigserial primary key,
    channel_id bigint not null references channel (id) on delete cascade,
    client_id  uuid   not null references client.profile (id)
);

create table organizer.media
(
    id           bigserial primary key,
    file_name    text  not null,
    mime_type    text  not null,
    file_data    bytea not null,
    created_time timestamp default current_timestamp
);

create table loyalty.prize
(
    id         uuid default gen_random_uuid() primary key,
    owner_uuid uuid,
    bonus_cost integer,
    file_data  bytea not null,
    amount     integer
);

create table loyalty.promocodes
(
    id              bigserial primary key,
    owner_uuid      uuid,
    bonus_amount    integer,
    number_of_usage integer,
    value           varchar
);

create table loyalty.bonus_balance
(
    id                   bigserial primary key,
    participant_username varchar,
    organizer_uuid       uuid,
    bonus_amount         integer
);

create table loyalty.prize_history
(
    id                   bigserial primary key,
    participant_username varchar,
    organizer_uuid       uuid,
    prize_uuid           uuid,
    delivered            boolean
)