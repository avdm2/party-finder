package ru.partyfinder.model.exception;

public class IllegalBonusBalance extends RuntimeException {
    public IllegalBonusBalance(String message) {
        super(message);
    }
}
