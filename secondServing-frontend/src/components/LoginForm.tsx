import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserType } from '../types';
import { login } from '../api/auth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState<UserType>('shelter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the userType from localStorage when component mounts
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') as UserType;
    if (storedUserType) {
      setUserType(storedUserType);
    }
    
    // Check if there's a userType in query params
    const params = new URLSearchParams(location.search);
    const typeFromParams = params.get('type') as UserType;
    if (typeFromParams && (typeFromParams === 'shelter' || typeFromParams === 'donator')) {
      setUserType(typeFromParams);
      localStorage.setItem('userType', typeFromParams);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await login(email, password, userType);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const switchUserType = () => {
    const newUserType = userType === 'shelter' ? 'donator' : 'shelter';
    setUserType(newUserType);
    localStorage.setItem('userType', newUserType);
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
            <Link 
              to={`/register/${userType}`}
              className={`font-medium ${
                userType === 'shelter' ? 'text-teal-600 hover:text-teal-800' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Register
            </Link>
          </p>
          
          <button 
            onClick={switchUserType}
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