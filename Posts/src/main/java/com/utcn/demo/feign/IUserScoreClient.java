package com.utcn.demo.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", url = "http://localhost:8080/user")
public interface IUserScoreClient {
    @PostMapping("/score/{userID}")
    public ResponseEntity<String> updateScore(@PathVariable Long userID, @RequestParam float score);
}
