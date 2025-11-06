import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Container, 
  Card, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Work } from '@mui/icons-material';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Box
        sx={{
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: 3,
          p: 4,
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xs">
          <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Work sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: 'primary.main',
              }}
            >
              Workforce
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'text.secondary',
                fontWeight: 600,
              }}
            >
              Wellbeing Analytics Platform
            </Typography>
          </Box>

          {/* Login Form Card */}
          <Card sx={{ p: 4, boxShadow: 2 }}>
            <form onSubmit={handleLogin}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  fullWidth
                  required
                  disabled={loading}
                  variant="outlined"
                />

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  fullWidth
                  required
                  disabled={loading}
                  variant="outlined"
                />

                {error && (
                  <Alert severity="error">{error}</Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Signing in...
                    </Box>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Stack>
            </form>

            <Box sx={{ textAlign: 'center', pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setOpenCreateDialog(true)}
                  disabled={loading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    p: 0,
                    ml: 0.5,
                  }}
                >
                  Create Account
                </Button>
              </Typography>
            </Box>
          </Card>
          </Stack>
        </Container>
      </Box>

      {/* Create Account Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          Create Account
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
            <Typography variant="body2" color="text.secondary">
              Select the type of account you want to create:
            </Typography>
            <Stack spacing={1.5}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setOpenCreateDialog(false);
                  navigate('/register/member');
                }}
                sx={{ py: 1.2, textTransform: 'none', fontSize: '1rem' }}
              >
                Member Login
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setOpenCreateDialog(false);
                  navigate('/register/supervisor');
                }}
                sx={{ py: 1.2, textTransform: 'none', fontSize: '1rem' }}
              >
                Supervisor Login
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
