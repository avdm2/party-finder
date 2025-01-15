package ru.partyfinder.auth.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.partyfinder.auth.models.enums.LoginUserType;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest extends AbstractCredentials {

    private String firstname;
    private String lastname;

    private LoginUserType userType;
}
