// components/ForgotPassword.jsx
import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_BASE = 'https://safetysolution.onrender.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail(''); // Réinitialiser le champ
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

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Mot de passe oublié</h1>
          <p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="submit-button"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <a href="/login" className="back-to-login">
            ← Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;