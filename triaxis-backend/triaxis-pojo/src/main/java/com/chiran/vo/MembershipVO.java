package com.chiran.vo;

import lombok.Data;

import java.util.Date;

@Data
public class MembershipVO {
    private Integer membershipLevel;
    private String membershipLevelName;
    private Date membershipExpiresAt;
    private Boolean isExpired;
    private Long remainingDays;
}
