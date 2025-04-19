package ru.partyfinder.config.kafka;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ConfirmationRequest {

    @JsonProperty("username")
    private String username;

    @JsonProperty("email")
    private String email;


    @Override
    public String toString() {
        return "ConfirmationRequest{" +
                "username='" + username + '\'' +
                '}';
    }
}