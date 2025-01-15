create table event_instance
(
    id          uuid default gen_random_uuid() not null
        primary key,
    owner       uuid                           not null,
    title       varchar                        not null,
    description varchar                        not null
);