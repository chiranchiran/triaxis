package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class UserUpdateDTO implements Serializable {
    private Integer id;
    private String username;
    private String email;
    private String phone;
    private String avatarUrl;
    private String bio;
    private Integer gender;
    private Date birthDate;
    private String school;
    private String major;
    private String grade;
    private Integer professionalFieldId;
}