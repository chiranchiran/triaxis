package com.chiran.vo;

import com.chiran.bo.PostSearchBO;
import com.chiran.result.PageResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityHotVO implements Serializable {
    private Integer id;
    private String title;
    private Integer hot;
}
