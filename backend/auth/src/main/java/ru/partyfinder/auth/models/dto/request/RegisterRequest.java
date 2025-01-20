package ru.partyfinder.auth.models.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.partyfinder.auth.models.dto.AbstractCredentials;
import ru.partyfinder.auth.models.enums.Role;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest extends AbstractCredentials {

    private String firstname;
    private String lastname;
    private Role role;
}
