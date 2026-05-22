package com.utcn.demo.service;

import com.utcn.demo.entity.Comment;
import com.utcn.demo.entity.Post;
import com.utcn.demo.entity.Vote;
import com.utcn.demo.feign.IUserScoreClient;
import com.utcn.demo.repository.VoteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VoteService {
    @Autowired private VoteRepository voteRepository;
    @Autowired private PostService postService;
    @Autowired private CommentService commentService;
    @Autowired private IUserScoreClient userScoreClient;

    public Vote votePost(Long userID, Long postID, boolean upvote) {
        Post post = postService.findById(postID.intValue());
        if (post == null) {
            throw new IllegalArgumentException("Post not found");
        }
        // nu poti vota propriul post
        if (post.getUserID().equals(userID)) {
            return null;
        }

        Optional<Vote> existingVote = voteRepository.findByUserIDAndPostID(userID, postID);
        if (existingVote.isPresent()) {
            // actualizeaza votul deja existent si trimitere user score-ul corespunzator
            Vote vote = existingVote.get();
            if (vote.isUpvote() != upvote && upvote == true) {
                vote.setUpvote(upvote);
                userScoreClient.updateScore(post.getUserID(), 4.0f);
                return voteRepository.save(vote);
            } else if (vote.isUpvote() != upvote) {
                vote.setUpvote(upvote);
                userScoreClient.updateScore(post.getUserID(), -4.0f);
                return voteRepository.save(vote);
            }
            return vote;
        }
        // update user Score
        if (upvote == true) userScoreClient.updateScore(post.getUserID(), 2.5f);
        else userScoreClient.updateScore(post.getUserID(), -1.5f);
        Vote vote = new Vote();
        vote.setUserID(userID);
        vote.setPostID(postID);
        vote.setUpvote(upvote);

        return voteRepository.save(vote);
    }

    // voteaza un comm, ret null daca user voteaza propriul comm
    public Vote voteComment(Long userID, Long commentID, boolean upvote) {
        Comment comment = commentService.findById(commentID.intValue());
        if (comment == null) {
            throw new IllegalArgumentException("Comment not found");
        }
        // comm propriu
        if (Long.valueOf(comment.getUserID()).equals(userID)) {
            return null;
        }
        Optional<Vote> existingVote = voteRepository.findByUserIDAndCommentID(userID, commentID);
        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.isUpvote() != upvote && upvote == true) {
                vote.setUpvote(upvote);
                userScoreClient.updateScore(comment.getUserID(), 7.5f);
                userScoreClient.updateScore(userID, 1.5f);
                return voteRepository.save(vote);
            } else if (vote.isUpvote() != upvote) {
                vote.setUpvote(upvote);
                userScoreClient.updateScore(comment.getUserID(), -7.5f);
                userScoreClient.updateScore(userID, -1.5f);
                return voteRepository.save(vote);
            }
            return vote;
        }
        if (upvote == true) userScoreClient.updateScore(comment.getUserID(), 5.f);
        else {
            userScoreClient.updateScore(comment.getUserID(), -2.5f);
            userScoreClient.updateScore(userID, -1.5f);
        }
        Vote vote = new Vote();
        vote.setUserID(userID);
        vote.setCommentID(commentID);
        vote.setUpvote(upvote);
        return voteRepository.save(vote);
    }

    public int getPostVoteCount(Long postID) {
        int upvotes = voteRepository.countByPostIDAndUpvote(postID, true);
        int downvotes = voteRepository.countByPostIDAndUpvote(postID, false);
        return upvotes - downvotes;
    }

    public int getPostUpvoteCount(Long postID) {
        return voteRepository.countByPostIDAndUpvote(postID, true);
    }

    public int getPostDownvoteCount(Long postID) {
        return voteRepository.countByPostIDAndUpvote(postID, false);
    }

    public int getCommentVoteCount(Long commentID) {
        int upvotes = voteRepository.countByCommentIDAndUpvote(commentID, true);
        int downvotes = voteRepository.countByCommentIDAndUpvote(commentID, false);
        return upvotes - downvotes;
    }

    public int getCommentUpvoteCount(Long commentID) {
        return voteRepository.countByCommentIDAndUpvote(commentID, true);
    }

    public int getCommentDownvoteCount(Long commentID) {
        return voteRepository.countByCommentIDAndUpvote(commentID, false);
    }

    public void deleteVote(Long voteID) {
        voteRepository.deleteById(voteID);
    }
}
