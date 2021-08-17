package com.example.demo.model;

import org.springframework.stereotype.Component;

@Component
public class ClientSearchCriteria {
    private String firstName = "";
    private String lastName = "";

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
