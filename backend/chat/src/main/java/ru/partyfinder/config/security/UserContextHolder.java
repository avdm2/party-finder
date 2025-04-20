package ru.partyfinder.config.security;


public class UserContextHolder {

    private static final ThreadLocal<UserRequest> userContext = new ThreadLocal<>();

    public static UserRequest getContext() {
        UserRequest context = userContext.get();
        if (context == null) {
            context = createEmptyContext();
            userContext.set(context);
        }
        return userContext.get();
    }

    private static UserRequest createEmptyContext() {
        return new UserRequest();
    }

    public static void setContext(UserRequest userRequest) {
        userContext.set(userRequest);
    }
}
