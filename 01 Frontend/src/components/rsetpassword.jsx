// components/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const API_BASE = 'https://safetysolution.onrender.com/api';

  // Vérifier la validité du token au chargement
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Token manquant');
        setValidatingToken(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/validate-reset-token/${token}`);
        const data = await response.json();

        if (response.ok) {
          setTokenValid(true);
        } else {
          setError(data.error || 'Token invalide ou expiré');
        }
      } catch (err) {
        console.error('Erreur validation token:', err);
        setError('Erreur de connexion au serveur');
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validation côté client
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({ password: '', confirmPassword: '' });
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (validatingToken) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Vérification du token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <h1>Lien invalide</h1>
            <p>Ce lien de réinitialisation est invalide ou a expiré</p>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="reset-password-footer">
            <a href="/forgot-password" className="retry-link">
              Demander un nouveau lien
            </a>
            <a href="/login" className="back-to-login">
              ← Retour à la connexion
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>Nouveau mot de passe</h1>
          <p>Définissez votre nouveau mot de passe</p>
        </div>

        {message && (
          <div className="success-message">
            {message}
            <p><small>Redirection vers la connexion...</small></p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <div className="password-input-container">
                <input
                  id="password"
                  name="password"
                  type={showPasswords ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="toggle-password-btn"
                  disabled={loading}
                >
                  {showPasswords ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.password || !formData.confirmPassword}
              className="submit-button"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}

        <div className="reset-password-footer">
          <a href="/login" className="back-to-login">
            ← Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;