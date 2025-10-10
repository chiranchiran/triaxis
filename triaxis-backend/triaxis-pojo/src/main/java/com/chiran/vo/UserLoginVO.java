package com.chiran.vo;

import lombok.*;

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
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginVO implements Serializable {

    private static final long serialVersionUID = 1L;
    private String accessToken;
    private String refreshToken;
    private UserInfoVO userInfo;
}
