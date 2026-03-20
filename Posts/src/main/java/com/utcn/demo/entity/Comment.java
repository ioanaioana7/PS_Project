package com.utcn.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int userID;
    @Column
    private String content;
    @Column
    private String picturePath;
    @Column
    private LocalDateTime createTime;

    @ManyToOne
    @JoinColumn(name = "comment_id", referencedColumnName = "id")
    private Post post;

}