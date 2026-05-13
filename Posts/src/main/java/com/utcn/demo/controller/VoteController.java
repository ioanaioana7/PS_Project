package com.utcn.demo.controller;

import com.utcn.demo.entity.Vote;
import com.utcn.demo.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vote")
public class VoteController {
    @Autowired
    private VoteService voteService;
    @PostMapping("/post/{postID}")
    public ResponseEntity<?> votePost(@PathVariable Long postID,
                                      @RequestParam Long userID,
                                      @RequestParam boolean upvote){
        Vote vote = voteService.votePost(userID, postID, upvote);
        if(vote == null){
            return ResponseEntity.badRequest().body("You cannot vote on your own post");
        }
        return ResponseEntity.ok(vote);
    }

    @PostMapping("/comment/{commentID}")
    public ResponseEntity<?> voteComment(
            @PathVariable Long commentID,
            @RequestParam Long userID,
            @RequestParam boolean upvote) {
        Vote vote = voteService.voteComment(userID, commentID, upvote);
        if (vote == null) {
            return ResponseEntity.badRequest().body("Cannot vote on your own comment");
        }
        return ResponseEntity.ok(vote);
    }

    @GetMapping("/post/{postID}/count")
    public int getPostVoteCount(@PathVariable Long postID) {
        return voteService.getPostVoteCount(postID);
    }

    @GetMapping("/post/{postID}/upvoteCount")
    public int getPostUpvoteCount(@PathVariable Long postID) {
        return voteService.getPostUpvoteCount(postID);
    }
    @GetMapping("/post/{postID}/downvoteCount")
    public int getPostDownvoteCount(@PathVariable Long postID) {
        return voteService.getPostDownvoteCount(postID);
    }

    @GetMapping("/comment/{commentID}/count")
    public int getCommentVoteCount(@PathVariable Long commentID) {
        return voteService.getCommentVoteCount(commentID);
    }
    @GetMapping("/comment/{commentID}/upvoteCount")
    public int getCommentUpvoteCount(@PathVariable Long commentID) {
        return voteService.getCommentUpvoteCount(commentID);
    }
    @GetMapping("/comment/{commentID}/downvoteCount")
    public int getCommentDownvoteCount(@PathVariable Long commentID) {
        return voteService.getCommentDownvoteCount(commentID);
    }
}
