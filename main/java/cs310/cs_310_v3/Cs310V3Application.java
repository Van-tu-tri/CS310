package cs310.cs_310_v3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class Cs310V3Application {

    public static void main(String[] args) {
        SpringApplication.run(Cs310V3Application.class, args);
    }

}
