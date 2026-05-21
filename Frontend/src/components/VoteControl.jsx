import { useState, useEffect } from 'react';
import { votePost, fetchPostVoteCount } from '../api';

/**
 * VoteControl Component
 * Handles upvoting and downvoting for a post.
 */
function VoteControl({ postId, initialCount = 0 }) {
  const [voteCount, setVoteCount] = useState(initialCount);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch fresh vote count on mount
    fetchPostVoteCount(postId)
      .then(count => setVoteCount(count))
      .catch(err => console.error('Failed to fetch vote count:', err));
  }, [postId]);

  const handleVote = async (upvote) => {
    if (!user) {
      setError('You must be logged in to vote');
      return;
    }

    try {
      await votePost(postId, user.id, upvote);
      const newCount = await fetchPostVoteCount(postId);
      setVoteCount(newCount);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to vote');
    }
  };

  return (
    <div className="vote-control">
      <button 
        onClick={() => handleVote(true)} 
        className="vote-btn upvote"
        title="Upvote"
      >
        ▲
      </button>
      <span className="vote-count">{voteCount}</span>
      <button 
        onClick={() => handleVote(false)} 
        className="vote-btn downvote"
        title="Downvote"
      >
        ▼
      </button>
      {error && <div className="vote-error">{error}</div>}
    </div>
  );
}

export default VoteControl;
