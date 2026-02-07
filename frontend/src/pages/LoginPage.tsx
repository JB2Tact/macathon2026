import { useNavigate } from 'react-router-dom';
import { AuthForm, type AuthFormData } from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: AuthFormData) => {
    await signIn(data.email, data.password);
    navigate('/send');
  };

  return (
    <AuthForm
      mode="login"
      onSubmit={handleSubmit}
      onToggleMode={() => navigate('/signup')}
    />
  );
}
