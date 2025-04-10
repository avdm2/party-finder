create schema event;
create schema auth;
create schema client;
create schema organizer;
create schema source;
create schema loyalty;
create schema channels;

create table client.media
(
    id           bigserial primary key,
    file_name    text  not null,
    mime_type    text  not null,
    file_data    bytea not null,
    created_time timestamp
);

create table client.profile
(
    id           uuid   primary key,
    username     varchar(255) unique,
    name         varchar(255)  not null,
    surname      varchar(255)  not null,
    email        varchar(255)  not null,
    phone        varchar(255) not null,
    about_me     varchar(255) not null,
    birth_date   date          not null,
    media_id     bigint references client.media (id),
    rating       decimal(3, 2) not null ,
    is_confirmed boolean       not null,
    created_time timestamp     not null,
    updated_time timestamp     not null
);

create table source.new_ratings
(
    id           bigserial primary key,
    entity_type  text          not null,
    entity_id    uuid          not null,
    sender_entity_type  text          not null,
    sender_entity_id uuid      not null,
    comment      text,
    score        decimal(3, 2) not null,
    created_time timestamp     not null,
    processed    boolean       not null
);

create table source.rating
(
    id           bigserial primary key,
    entity_type  text          not null,
    entity_id    uuid          not null,
    score        decimal(3, 2) not null ,
    created_time timestamp     not null
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
        constraint fk55itppkw3i07do3h7qoclqd4k references auth."user",
    role    varchar(255)
);

create table organizer.media
(
    id           bigserial primary key,
    file_name    text  not null,
    mime_type    text  not null,
    file_data    bytea not null,
    created_time timestamp
);

create table organizer.organizer
(
    id          uuid  primary key,
    name        varchar not null,
    surname     varchar not null,
    birth_date  date    not null,
    username    varchar not null,
    media_id    bigint references organizer.media (id),
    description varchar,
    rating       decimal(3, 2) not null
);

create table organizer.event_instance
(
    id              uuid not null
        primary key,
    organizer_id           uuid                           not null,
    title           varchar                        not null,
    description     varchar                        not null,
    date            timestamp                      not null,
    address         varchar                        not null,
    status          varchar                        not null,
    price           decimal(12, 2),
    capacity        smallint,
    age_restriction smallint,
    rating       decimal(3, 2) not null
);

create table organizer.event_client
(
    id              uuid  not null
        primary key,
    eventId           uuid                           not null,
    username          varchar                        not null,
    createdTime     timestamp
);



/*create table organizer.rating
(
    id           bigserial
        primary key,
    organizer_id uuid,
    rating       smallint
);*/

CREATE TABLE organizer.channel
(
    id   bigserial primary key,
    uuid uuid         not null,
    name varchar(255) not null
);

CREATE TABLE organizer.channel_profile
(
    id         bigserial primary key,
    channel_id bigint not null references organizer.channel (id) on delete cascade,
    client_id  uuid   not null references client.profile (id)
);



create table loyalty.prize
(
    id         uuid  primary key,
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
);

CREATE TABLE channels.channels (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_username varchar(255) not null
);

CREATE TABLE channels.subscribers (
    id UUID PRIMARY KEY,
    channel_id UUID REFERENCES channels(id),
    subscriber_id UUID NOT NULL
);

CREATE TABLE channels.messages (
    id UUID PRIMARY KEY,
    channel_id UUID REFERENCES channels(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
