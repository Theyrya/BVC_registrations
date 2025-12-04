import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const API_BASE = 'http://localhost:5000/api';

const IMAGES = [
  {
    src: 'https://secondnature.org/wp-content/uploads/2025/08/20250610_Sustainability_TagGame_HKA6218_Social-1-1024x768.jpg',
    title: 'Top Graduation Rate',
    desc: 'Consistently above provincial average.'
  },
  {
    src: 'https://ml.globenewswire.com/Resource/Download/78fb4802-6d09-4f52-8a26-6fecf985462c',
    title: 'Industry Partnerships',
    desc: '250+ employers hiring our grads.'
  },
  {
    src: 'https://cdn.prod.website-files.com/61146872244cf471c8c582f1/61578db5b1ea1562af651301_Daughter_BVC_Q1.png',
    title: 'Cutting-Edge Labs',
    desc: 'Hands-on learning with modern tech.'
  },
  {
    src: 'https://static.wixstatic.com/media/b48666_9c1eb1340f0e4c86a5680b054300b0ec~mv2.jpg/v1/fill/w_640,h_536,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/b48666_9c1eb1340f0e4c86a5680b054300b0ec~mv2.jpg',
    title: 'Vibrant Community',
    desc: 'Clubs, events, and support all year.'
  },
  {
    src: 'https://media.licdn.com/dms/image/v2/D5622AQF3ASrAfgE2tQ/feedshare-shrink_800/feedshare-shrink_800/0/1719069312660?e=2147483647&v=beta&t=5d9zD0KXCvgL969EsMQC88R80VlHw1cuX7gIBqhlpVA',
    title: 'Scholarships & Awards',
    desc: '$1.5M+ awarded annually.'
  }
];

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % IMAGES.length), 2000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      // Save auth token and user data to localStorage
      const { token, user } = data;
      localStorage.setItem('auth', JSON.stringify({ 
        isAuthenticated: true, 
        token,
        user 
      }));

      onLogin(true, user.isAdmin, user, token);
      navigate(user.isAdmin ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError('Error connecting to server. Make sure the backend is running.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const current = IMAGES[idx];

  return (
    <div className="login-page">
      <div className="auth-wrap">
        <aside className="showcase">
          <div className="showcase-media">
            <img key={idx} src={current.src} alt={current.title} className="showcase-img" />
            <div className="showcase-overlay"></div>
            <div className="showcase-caption">
              <h3>{current.title}</h3>
              <p>{current.desc}</p>
            </div>
          </div>
        </aside>

        <div className="login-container">
          <div className="login-paper">
            <h2 className="login-title">Login</h2>
            {error && <div role="alert" className="login-error">{error}</div>}
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <label className="login-label">
                Username
                <input
                  className="login-input"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </label>

              <label className="login-label">
                Password
                <input
                  className="login-input"
                  required
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>

              <div className="login-actions">
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
