import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      // Limiting to 10 for better readability in your UI
      setPosts(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.body) return alert("Please fill in all fields");
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', body: '' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const updatePost = async () => {
    if (!selectedPost) return;
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${selectedPost.id}`, selectedPost);
      const updatedPosts = posts.map(post =>
        post.id === selectedPost.id ? response.data : post
      );
      setPosts(updatedPosts);
      setSelectedPost(null); 
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  // Basic styling to match your dark-themed environment
  const styles = {
    container: { backgroundColor: '#1e1e1e', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'Arial' },
    card: { backgroundColor: '#2d2d2d', padding: '15px', borderRadius: '8px', marginBottom: '10px' },
    input: { display: 'block', width: '100%', marginBottom: '10px', padding: '8px', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555' },
    button: { padding: '8px 15px', cursor: 'pointer', marginRight: '5px' },
    deleteBtn: { backgroundColor: '#d9534f', color: 'white', border: 'none' },
    editBtn: { backgroundColor: '#5bc0de', color: 'white', border: 'none' }
  };

  return (
    <Router>
      <div style={styles.container}>
        <h1>React REST API Manager</h1>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#007bff' }}>Home</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              {/* UPDATE SECTION (Only shows when editing) */}
              {selectedPost ? (
                <div style={styles.card}>
                  <h2>Edit Post #{selectedPost.id}</h2>
                  <input
                    style={styles.input}
                    value={selectedPost.title}
                    onChange={e => setSelectedPost({ ...selectedPost, title: e.target.value })}
                  />
                  <textarea
                    style={styles.input}
                    value={selectedPost.body}
                    onChange={e => setSelectedPost({ ...selectedPost, body: e.target.value })}
                  />
                  <button style={{...styles.button, backgroundColor: '#5cb85c', color: 'white', border: 'none'}} onClick={updatePost}>Save Changes</button>
                  <button style={styles.button} onClick={() => setSelectedPost(null)}>Cancel</button>
                </div>
              ) : (
                /* CREATE SECTION */
                <div style={styles.card}>
                  <h2>Create New Post</h2>
                  <input
                    style={styles.input}
                    placeholder="Title"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                  />
                  <textarea
                    style={styles.input}
                    placeholder="Body"
                    value={newPost.body}
                    onChange={e => setNewPost({ ...newPost, body: e.target.value })}
                  />
                  <button style={{...styles.button, backgroundColor: '#007bff', color: 'white', border: 'none'}} onClick={createPost}>Create</button>
                </div>
              )}

              {/* READ SECTION */}
              <h2>Recent Posts</h2>
              {posts.map(post => (
                <div key={post.id} style={styles.card}>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <button style={{...styles.button, ...styles.editBtn}} onClick={() => setSelectedPost(post)}>Edit</button>
                  <button style={{...styles.button, ...styles.deleteBtn}} onClick={() => deletePost(post.id)}>Delete</button>
                </div>
              ))}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;