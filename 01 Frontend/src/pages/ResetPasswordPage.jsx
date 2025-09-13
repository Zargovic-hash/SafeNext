import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CardHeader from '../components/ui/CardHeader';
import CardTitle from '../components/ui/CardTitle';
import CardContent from '../components/ui/CardContent';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import { PasswordHideIcon, PasswordViewIcon } from '../icons/icon';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  // Validate token when component loads
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Token de réinitialisation manquant');
        setValidatingToken(false);
        return;
      }

      try {
        const response = await fetch(`https://safetysolution.onrender.com/api/auth/validate-reset-token/${token}`);
        const data = await response.json();

        if (response.ok) {
          setTokenValid(true);
          setError('');
        } else {
          setError(data.error || 'Token invalide ou expiré');
          setTokenValid(false);
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  // Password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Le mot de passe doit contenir au moins ${minLength} caractères`;
    }
    if (!hasUpperCase) {
      return 'Le mot de passe doit contenir au moins une majuscule';
    }
    if (!hasLowerCase) {
      return 'Le mot de passe doit contenir au moins une minuscule';
    }
    if (!hasNumbers) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    if (!hasSpecialChar) {
      return 'Le mot de passe doit contenir au moins un caractère spécial';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://safetysolution.onrender.com/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: formData.password,
          confirmPassword: formData.confirmPassword 
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Votre mot de passe a été réinitialisé avec succès !');
        // Clear form for security
        setFormData({ password: '', confirmPassword: '' });
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setError(data.error || 'Erreur lors de la réinitialisation du mot de passe');
        toast.error(data.error || 'Erreur lors de la réinitialisation du mot de passe');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Erreur de connexion au serveur');
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Show loading state while validating token
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Validation du token en cours...</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show error state if token is invalid
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-red-600">Token Invalide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <p className="text-gray-600 mb-6">
                Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.
              </p>
              <div className="space-y-4">
                <Link to="/forgot-password">
                  <Button className="w-full">
                    Demander un nouveau lien
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Entrez votre nouveau mot de passe"
                    required
                    className={error && error.includes('mot de passe') ? 'border-red-300' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? 
                      <PasswordHideIcon className="h-5 w-5" /> : 
                      <PasswordViewIcon className="h-5 w-5" />
                    }
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 caractères, incluant majuscule, minuscule, chiffre et caractère spécial
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                    className={error && error.includes('correspondent') ? 'border-red-300' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? 
                      <PasswordHideIcon className="h-5 w-5" /> : 
                      <PasswordViewIcon className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !formData.password || !formData.confirmPassword}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Réinitialisation...
                  </div>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm">
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;