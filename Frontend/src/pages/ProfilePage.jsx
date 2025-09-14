import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Vous devez être connecté pour voir cette page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="max-w-lg w-full shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.first_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Mon Profil</CardTitle>
          <p className="text-gray-500">Informations personnelles</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">Prénom</span>
            <span className="font-medium">{user.first_name}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">Nom</span>
            <span className="font-medium">{user.last_name}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
