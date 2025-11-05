package com.chiran.bo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSearchBO implements Serializable {
    private PostDetailBO postDetail;
    private UserBO uploader;
    private UserActionsBO userActions;
}
