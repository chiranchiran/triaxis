package com.chiran.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

// 必须添加 @Component，确保被 Spring 扫描并注入
@Component
public class MyBatisPlusMetaObjectHandler implements MetaObjectHandler {

    // 插入时自动填充（对应 fill = FieldFill.INSERT）
    @Override
    public void insertFill(MetaObject metaObject) {
        // 填充 createTime：字段名必须和实体类属性名一致（区分大小写）
        this.strictInsertFill(
                metaObject,
                "createTime",  // 实体类属性名（不是数据库列名）
                LocalDateTime.class,
                LocalDateTime.now()  // 填充当前时间
        );

        // 填充 updateTime（插入时也需要填充，对应 fill = FieldFill.INSERT_UPDATE）
        this.strictInsertFill(
                metaObject,
                "updateTime",  // 实体类属性名
                LocalDateTime.class,
                LocalDateTime.now()
        );
        this.strictInsertFill(
                metaObject,
                "sendTime",  // 实体类属性名
                LocalDateTime.class,
                LocalDateTime.now()
        );
    }

    // 更新时自动填充（对应 fill = FieldFill.INSERT_UPDATE）
    @Override
    public void updateFill(MetaObject metaObject) {
        // 填充 updateTime：更新时刷新时间
        this.strictUpdateFill(
                metaObject,
                "updateTime",  // 实体类属性名
                LocalDateTime.class,
                LocalDateTime.now()
        );
    }
}
