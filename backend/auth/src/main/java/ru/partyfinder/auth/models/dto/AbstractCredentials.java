package ru.partyfinder.auth.models.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class AbstractCredentials {

    private String username;
    private String password;
}
