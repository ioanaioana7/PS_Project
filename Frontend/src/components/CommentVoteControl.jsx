import { useState, useEffect } from 'react';
import { voteComment, fetchCommentVoteCount } from '../api';

/**
 * CommentVoteControl Component
 * Handles upvoting and downvoting for a comment.
 */
function CommentVoteControl({ commentId, initialCount = 0 }) {
  const [voteCount, setVoteCount] = useState(initialCount);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCommentVoteCount(commentId)
      .then(count => setVoteCount(count))
      .catch(err => console.error('Failed to fetch comment vote count:', err));
  }, [commentId]);

  const handleVote = async (upvote) => {
    if (!user) {
      setError('Log in to vote');
      return;
    }

    try {
      await voteComment(commentId, user.id, upvote);
      const newCount = await fetchCommentVoteCount(commentId);
      setVoteCount(newCount);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to vote');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="vote-control comment-vote">
      <button 
        onClick={() => handleVote(true)} 
        className="vote-btn upvote"
        style={{ fontSize: '0.9rem' }}
      >
        ▲
      </button>
      <span className="vote-count" style={{ fontSize: '0.85rem' }}>{voteCount}</span>
      <button 
        onClick={() => handleVote(false)} 
        className="vote-btn downvote"
        style={{ fontSize: '0.9rem' }}
      >
        ▼
      </button>
      {error && <div className="vote-error" style={{ fontSize: '0.6rem', bottom: '-20px' }}>{error}</div>}
    </div>
  );
}

export default CommentVoteControl;
