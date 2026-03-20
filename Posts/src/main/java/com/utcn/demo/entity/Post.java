package com.utcn.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    private Long userID;
    @Column
    private String title;
    @Column
    private String content;
    @Column(nullable = false)
    private LocalDateTime postDate;
    @Column
    private String picturePath;
    @Column
    private String status;
    @Column
    private String tag;
}
