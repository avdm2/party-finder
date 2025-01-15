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
public class LoginRequest extends AbstractCredentials {

    private LoginUserType userType;
}
