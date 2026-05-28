import { useState } from 'react';
import { getImageUrl, uploadImage } from '../api';
import CommentVoteControl from '../components/CommentVoteControl';

/**
 * Single Comment Component
 * Added: Image editing functionality and Admin controls.
 */
function CommentItem({ comment, currentUser, onDelete, onUpdate, isAdmin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(comment.picturePath ? getImageUrl(comment.picturePath) : null);

  const handleUpdate = async () => {
    try {
      let imageUrl = comment.picturePath;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      await onUpdate(comment.id, { ...comment, content: editContent, picturePath: imageUrl });
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      alert('Failed to update comment');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const commentImage = comment.picturePath ? getImageUrl(comment.picturePath) : null;

  return (
    <div className="comment-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ flex: 1 }}>
        <div className="comment-header">
          <strong>User #{comment.userID}</strong>
          <span style={{ fontSize: '0.75rem', opacity: '0.7', marginLeft: '10px' }}>{comment.createTime}</span>
        </div>

        {isEditing ? (
          <div className="edit-comment-area" style={{ marginTop: '10px' }}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '10px' }}
            />
            <div style={{ marginTop: '10px' }}>
                <label style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem' }}>Change Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginLeft: '10px' }} />
                {previewUrl && (
                    <img src={previewUrl} alt="Preview" style={{ display: 'block', maxWidth: '100px', borderRadius: '8px', marginTop: '10px' }} />
                )}
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '5px' }}>
              <button onClick={handleUpdate} className="nav-btn" style={{ fontSize: '0.8rem', padding: '5px 10px', background: '#4ade80', border: 'none', color: 'white' }}>Save</button>
              <button onClick={() => { setIsEditing(false); setPreviewUrl(commentImage); }} className="nav-btn" style={{ fontSize: '0.8rem', padding: '5px 10px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ marginTop: '5px' }}>{comment.content}</p>
            {commentImage && (
              <img src={commentImage} alt="Comment" style={{ maxWidth: '150px', borderRadius: '8px', marginTop: '10px' }} />
            )}
          </div>
        )}

        {currentUser && (isAdmin || comment.userID == currentUser.id) && !isEditing && (
          <div className="comment-actions" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: '#e9e9ff', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
            <button onClick={() => onDelete(comment.id)} style={{ background: 'none', border: 'none', color: '#fca5a5', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
          </div>
        )}
      </div>

      <CommentVoteControl commentId={comment.id} />
    </div>
  );
}

export default CommentItem;
