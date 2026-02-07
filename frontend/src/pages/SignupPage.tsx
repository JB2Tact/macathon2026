import { useNavigate } from 'react-router-dom';
import { AuthForm, type AuthFormData } from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: AuthFormData) => {
    await signUp(data.email, data.password, data.displayName || '');
    navigate('/send');
  };

  return (
    <AuthForm
      mode="signup"
      onSubmit={handleSubmit}
      onToggleMode={() => navigate('/login')}
    />
  );
}
