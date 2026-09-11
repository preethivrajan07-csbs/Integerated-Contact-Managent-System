package com.icms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EntityScan(basePackages = "com.icms.entity")
@EnableJpaRepositories(basePackages = "com.icms.repository")
public class IcmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(IcmsApplication.class, args);
    }
}
