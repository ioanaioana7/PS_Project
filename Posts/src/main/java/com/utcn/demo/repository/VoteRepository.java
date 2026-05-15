package com.utcn.demo.repository;

import com.utcn.demo.entity.Vote;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends CrudRepository<Vote, Long> {
    Optional<Vote> findByUserIDAndPostID(Long userID, Long postID);
    Optional<Vote> findByUserIDAndCommentID(Long userID, Long commentID);
    int countByPostIDAndUpvote(Long postID, boolean upvote);
    int countByCommentIDAndUpvote(Long commentID, boolean upvote);

}
