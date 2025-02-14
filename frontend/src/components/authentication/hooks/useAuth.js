import { useState } from 'react';
import { signin, signup } from '../api/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInUser = async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await signin(email, password);
    setLoading(false);
    return result;
  };

  const signUpUser = async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await signup(email, password);
    setLoading(false);
    return result;
  };

  return { signInUser, signUpUser, loading, error };
};
