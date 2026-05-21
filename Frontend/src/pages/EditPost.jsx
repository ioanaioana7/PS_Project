import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostById, updatePost, uploadImage, getImageUrl } from '../api';
import './CreatePost.css';

/**
 * EditPost Component
 * Allows users to modify their existing posts.
 * Fixes: Input freezing by ensuring state is always updated.
 * Added: Tag editing support.
 */
function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    picturePath: '',
    userID: null,
    postDate: '',
    status: '',
    tags: []
  });
  
  const [tagsInput, setTagsInput] = useState(''); // Comma separated tags
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchPostById(id)
      .then(data => {
        if (!isMounted) return;
        if (user && data.userID != user.id) {
          navigate('/home');
          return;
        }
        setFormData(data);
        
        // Initialize tags input
        if (data.tags && Array.isArray(data.tags)) {
          setTagsInput(data.tags.map(t => t.description).join(', '));
        }

        if (data.picturePath) {
          setPreviewUrl(getImageUrl(data.picturePath));
        }
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        setError('Failed to load post data');
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id, navigate, user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Tag Validation
    const tagsArray = tagsInput.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    if (tagsArray.length === 0) {
      setError('Please add at least one tag');
      return;
    }

    setUpdating(true);
    setError('');

    try {
      let imageUrl = formData.picturePath;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const updatedPayload = {
        ...formData,
        picturePath: imageUrl,
        tags: tagsArray.map(tag => ({ description: tag }))
      };

      await updatePost(id, updatedPayload);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update post');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="create-post-container">
        <div className="status-message">Loading post details...</div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h1>Edit Post</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onInput={handleChange} 
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
              value={formData.content || ''}
              onInput={handleChange}
              onChange={handleChange}
              placeholder="Update your content..."
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
              placeholder="e.g. bug, fix, api"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="picture">Image (Click to change)</label>
            <input
              type="file"
              id="picture"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: '10px' }}
            />
            {previewUrl && (
              <div className="image-preview" style={{ marginTop: '15px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize: '0.8rem', padding: '5px', background: 'rgba(255,255,255,0.1)' }}>
                  {selectedFile ? 'New Image Preview:' : 'Current Image:'}
                </p>
                <img src={previewUrl} alt="Post" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={updating}>
            {updating ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>

        <button onClick={() => navigate(-1)} className="cancel-btn">
          Discard Changes
        </button>
      </div>
    </div>
  );
}

export default EditPost;
