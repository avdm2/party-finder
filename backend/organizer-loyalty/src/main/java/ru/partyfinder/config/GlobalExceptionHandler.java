package ru.partyfinder.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.partyfinder.model.ErrorMessage;
import ru.partyfinder.model.exception.IllegalBonusBalance;
import ru.partyfinder.model.exception.IllegalPromocodeException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalPromocodeException.class)
    public ResponseEntity<ErrorMessage> handle(IllegalPromocodeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorMessage.builder().message(ex.getMessage()).build());
    }

    @ExceptionHandler(IllegalBonusBalance.class)
    public ResponseEntity<ErrorMessage> handle(IllegalBonusBalance ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorMessage.builder().message(ex.getMessage()).build());
    }
}
