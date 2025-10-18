package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * <p>
 * 
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Data
public class UserRegisterPhoneDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private String phone;
    private String captcha;
    private String password;
}
