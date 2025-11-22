package com.chiran.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
public class UserLoginCountDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;
private String state;

}
