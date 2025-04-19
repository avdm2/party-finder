package ru.partyfinder.config.kafka;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfirmationCodeRequest {

    @JsonProperty("code")
    private String code;

    @Override
    public String toString() {
        return "ConfirmationCodeRequest{" +
                "code='" + code + '\'' +
                '}';
    }
}
