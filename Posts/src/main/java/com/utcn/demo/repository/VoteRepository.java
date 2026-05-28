package com.utcn.demo.repository;

import com.utcn.demo.entity.Vote;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends CrudRepository<Vote, Long> {
    Optional<Vote> findByUserIDAndPostID(Long userID, Long postID);
    Optional<Vote> findByUserIDAndCommentID(Long userID, Long commentID);
    int countByPostIDAndUpvote(Long postID, boolean upvote);
    int countByCommentIDAndUpvote(Long commentID, boolean upvote);

    @Transactional
    @Modifying
    void deleteByPostID(Long postID);

    @Transactional
    @Modifying
    void deleteByCommentID(Long commentID);
}
