import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CardHeader from '../components/ui/CardHeader';
import CardTitle from '../components/ui/CardTitle';
import CardContent from '../components/ui/CardContent';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import { toast } from 'react-toastify';


const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
        const response = await fetch(`${API_BASE}/auth/forgot-password`, {
          method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
        toast.success(data.message || 'Lien de réinitialisation envoyé !');
      } else {
        setError(data.error || 'Erreur lors de l\'envoi de l\'e-mail.');
        toast.error(data.error || 'Erreur lors de l\'envoi de l\'e-mail.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
      toast.error('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, 
y: -50 }}
        animate={{ opacity: 1, 
y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Mot de passe oublié ?</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
            <p className="text-sm text-gray-600 mb-6">
              Entrez votre adresse e-mail ci-dessous pour recevoir un lien de réinitialisation de mot de passe.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Adresse E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </Button>
            </form>
            <div className="mt-4 text-center">
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

export default ForgotPasswordPage;