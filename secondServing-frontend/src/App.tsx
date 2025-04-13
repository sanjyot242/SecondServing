import React, { useState } from 'react';
import UserTypeSelection from './components/UserTypeSelection';
import ShelterRegistrationForm from './components/ShelterRegistrationForm';
import DonatorRegistrationForm from './components/DonatorRegistrationForm';
import LoginForm from './components/LoginForm';
import { UserType } from './types';

enum AuthStage {
  SELECT_USER_TYPE,
  REGISTER,
  LOGIN,
  AUTHENTICATED
}

const App: React.FC = () => {
  const [authStage, setAuthStage] = useState<AuthStage>(AuthStage.SELECT_USER_TYPE);
  const [userType, setUserType] = useState<UserType | null>(null);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setAuthStage(AuthStage.REGISTER);
  };

  const handleRegistrationSuccess = () => {
    setAuthStage(AuthStage.AUTHENTICATED);
  };

  const handleLoginSuccess = () => {
    setAuthStage(AuthStage.AUTHENTICATED);
  };

  const switchToLogin = () => {
    setAuthStage(AuthStage.LOGIN);
  };

  const switchToRegistration = () => {
    setAuthStage(AuthStage.REGISTER);
  };

  const switchUserType = () => {
    setUserType(userType === 'shelter' ? 'donator' : 'shelter');
  };

  const renderAuthComponent = () => {
    switch (authStage) {
      case AuthStage.SELECT_USER_TYPE:
        return <UserTypeSelection onSelectUserType={handleUserTypeSelect} />;
      case AuthStage.REGISTER:
        return userType === 'shelter' ? (
          <ShelterRegistrationForm 
            onRegistrationSuccess={handleRegistrationSuccess} 
            switchToLogin={switchToLogin}
          />
        ) : (
          <DonatorRegistrationForm 
            onRegistrationSuccess={handleRegistrationSuccess} 
            switchToLogin={switchToLogin}
          />
        );
      case AuthStage.LOGIN:
        return userType ? (
          <LoginForm 
            userType={userType}
            onLoginSuccess={handleLoginSuccess}
            switchToRegistration={switchToRegistration}
            onSwitchUserType={switchUserType}
          />
        ) : (
          <UserTypeSelection onSelectUserType={handleUserTypeSelect} />
        );
      case AuthStage.AUTHENTICATED:
        return (
          <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SecondServing!</h1>
              <p className="text-gray-600 mb-8">
                You have successfully authenticated as a {userType}.
              </p>
              <button
                onClick={() => {
                  setAuthStage(AuthStage.SELECT_USER_TYPE);
                  setUserType(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        );
      default:
        return <UserTypeSelection onSelectUserType={handleUserTypeSelect} />;
    }
  };

  return (
    <div className="app">
      {renderAuthComponent()}
    </div>
  );
};

export default App;