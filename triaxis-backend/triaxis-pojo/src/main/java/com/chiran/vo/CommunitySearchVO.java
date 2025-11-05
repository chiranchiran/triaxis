package com.chiran.vo;

import com.chiran.bo.PostSearchBO;
import com.chiran.bo.ResourceSearchBO;
import com.chiran.bo.UserActionsBO;
import com.chiran.bo.UserBO;
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
public class CommunitySearchVO implements Serializable {
    private Long total;
    private PageResult<PostSearchBO> bounty;
    private PageResult<PostSearchBO> normal;
}
