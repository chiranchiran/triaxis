package com.chiran;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@MapperScan("com.chiran.mapper")
@SpringBootApplication
public class TriaxisServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TriaxisServerApplication.class, args);
    }

}
