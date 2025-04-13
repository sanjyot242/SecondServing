import React, { useState } from 'react';
import { UserType } from '../types';
import { login } from '../api/auth';

interface LoginFormProps {
  userType: UserType;
  onLoginSuccess: () => void;
  switchToRegistration: () => void;
  onSwitchUserType: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  userType,
  onLoginSuccess,
  switchToRegistration,
  onSwitchUserType
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password, userType);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
          <p className="text-gray-600 mt-2">
            {userType === 'shelter' 
              ? 'Access your shelter account' 
              : 'Access your donor account'}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-150 disabled:bg-gray-400 ${
              userType === 'shelter' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={switchToRegistration}
              className={`font-medium ${
                userType === 'shelter' ? 'text-teal-600 hover:text-teal-800' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Register
            </button>
          </p>
          
          <button 
            onClick={onSwitchUserType}
            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            I'm a {userType === 'shelter' ? 'Donor' : 'Shelter'} instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;