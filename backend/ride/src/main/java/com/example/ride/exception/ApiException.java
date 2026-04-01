package com.example.ride.exception;

public class ApiException extends RuntimeException {

    public ApiException(String message){
        super(message);
    }
}