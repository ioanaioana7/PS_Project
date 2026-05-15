package com.utcn.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vote")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(name = "userID", nullable = false)
    private Long userID;
    @Column(name = "postID")
    private Long postID;
    @Column(name = "commentID")
    private Long commentID;
    // true = upvote/like, false = downvote/dislike
    @Column(nullable = false)
    private boolean upvote;
}
