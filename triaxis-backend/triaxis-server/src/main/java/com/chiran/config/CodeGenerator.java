package com.chiran.config;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.sql.Types;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Slf4j
public class CodeGenerator {
    private static final String url="jdbc:mysql://192.168.218.128:3306/triaxis";
    private static final String username="root";
    private static final String password="654321";

    public static void main(String[] args) {
        log.debug("代码生成器开始执行");
        // 1. 获取数据库中所有表名
        List<String> tableNames = new ArrayList<>();
        Collections.addAll(tableNames,
                "course_categories",
                "course_review_likes",
                "course_reviews",
                "course_tag_relations",
                "course_tags",
                "courses",
                "favorite_items",
                "professional_fields",
                "resource_categories",
                "resource_rights",
                "resource_software",
                "resource_tag_relations",
                "resource_tags",
                "resources",
                "software_tools",
                "user_action_types",
                "user_actions",
                "user_favorites",
                "user_points_history",
                "users");

        FastAutoGenerator.create(url, username, password)
                .globalConfig(builder -> {
                    builder.author("chiran") // 设置作者
//                            .enableSwagger() // 开启 swagger 模式
                            .outputDir("triaxis-server\\src\\main\\java"); // 指定输出目录
                })
                .dataSourceConfig(builder ->
                        builder.typeConvertHandler((globalConfig, typeRegistry, metaInfo) -> {
                            int typeCode = metaInfo.getJdbcType().TYPE_CODE;
                            if (typeCode == Types.SMALLINT) {
                                // 自定义类型转换
                                return DbColumnType.INTEGER;
                            }
                            return typeRegistry.getColumnType(metaInfo);
                        })
                )
                .packageConfig(builder ->
                        builder.parent("com.chiran") // 设置父包名
                                .entity("entity") // 设置实体类包名
                                .mapper("mapper") // 设置 Mapper 接口包名
                                .service("service") // 设置 Service 接口包名
                                .serviceImpl("service.impl") // 设置 Service 实现类包名
                                .xml("mappers")// 设置 Mapper XML 文件包名
                )
                .strategyConfig(builder -> {
                    builder.addInclude(tableNames) // 设置需要生成的表名
                            .entityBuilder()
                            .enableLombok() // 启用 Lombok
                            .enableTableFieldAnnotation() // 启用字段注解
                            .controllerBuilder()
                            .enableRestStyle()// 启用 REST 风格
                            .controllerBuilder()
                            .enableHyphenStyle()
                            .enableRestStyle()
                            .serviceBuilder()
                            .formatServiceFileName("%sService")
                            .formatServiceImplFileName("%sServiceImpl")
                            .mapperBuilder();
                })
                .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }
}
