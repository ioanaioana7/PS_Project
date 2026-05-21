import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, uploadImage } from '../api';
import './CreatePost.css';

/**
 * CreatePost Component
 * Allows users to create a new post with tags and image.
 */
function CreatePost() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    picturePath: '', 
  });
  
  const [tagsInput, setTagsInput] = useState(''); // Comma separated tags
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!formData.title || !formData.content) {
      setError('Title and Content are required');
      return;
    }

    // Tag Validation: At least one tag
    const tagsArray = tagsInput.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    if (tagsArray.length === 0) {
      setError('Please add at least one tag');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = formData.picturePath;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const postData = {
        ...formData,
        picturePath: imageUrl,
        userID: user.id,
        postDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: 'Just Posted',
        tags: tagsArray.map(tag => ({ description: tag }))
      };

      await createPost(postData);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h1>Create New Post</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What's on your mind?"
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. bug, high-priority, frontend"
              required
            />
            <p style={{ fontSize: '0.75rem', marginTop: '5px', color: '#d1d5db' }}>
              Separate multiple tags with commas. New tags will be created automatically.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="picture">Image</label>
            <input
              type="file"
              id="picture"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="image-preview" style={{ marginTop: '15px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize: '0.8rem', padding: '5px', background: 'rgba(255,255,255,0.1)' }}>Preview:</p>
                <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
        <button onClick={() => navigate('/home')} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
