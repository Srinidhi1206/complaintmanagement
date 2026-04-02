package com.example.colony.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        if (ex.getMessage().contains("not found") || ex.getMessage().contains("Unauthorized")) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (ex.getMessage().contains("exists")) {
            status = HttpStatus.CONFLICT;
        }
        
        return new ResponseEntity<>(error, status);
    }
}
