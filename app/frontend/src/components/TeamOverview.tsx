import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  RemoveRedEye,
  Psychology,
  FitnessCenter,
  AccessTime,
  Assignment,
} from '@mui/icons-material';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  taskCompletionRate: number;
  loggedHours: number;
  wellbeingScore: number;
  isExhausted: boolean;
  stressLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
  lastActive: string;
}

interface TeamOverviewProps {
  onViewMember: (memberId: number) => void;
}

export const TeamOverview = ({ onViewMember }: TeamOverviewProps) => {
  // Mock data - in production, this would come from backend API
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@company.com',
      taskCompletionRate: 95,
      loggedHours: 42,
      wellbeingScore: 85,
      isExhausted: false,
      stressLevel: 'low',
      trend: 'up',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@company.com',
      taskCompletionRate: 78,
      loggedHours: 38,
      wellbeingScore: 72,
      isExhausted: false,
      stressLevel: 'medium',
      trend: 'stable',
      lastActive: '1 hour ago',
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@company.com',
      taskCompletionRate: 88,
      loggedHours: 45,
      wellbeingScore: 58,
      isExhausted: true,
      stressLevel: 'high',
      trend: 'down',
      lastActive: '30 minutes ago',
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david@company.com',
      taskCompletionRate: 92,
      loggedHours: 40,
      wellbeingScore: 78,
      isExhausted: false,
      stressLevel: 'low',
      trend: 'up',
      lastActive: '15 minutes ago',
    },
    {
      id: 5,
      name: 'Emma Brown',
      email: 'emma@company.com',
      taskCompletionRate: 65,
      loggedHours: 35,
      wellbeingScore: 65,
      isExhausted: true,
      stressLevel: 'high',
      trend: 'down',
      lastActive: '4 hours ago',
    },
  ];

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#2ecc71';
      case 'medium':
        return '#f39c12';
      case 'high':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getWellbeingStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: '#2ecc71' };
    if (score >= 70) return { label: 'Good', color: '#3498db' };
    if (score >= 60) return { label: 'Fair', color: '#f39c12' };
    return { label: 'Needs Attention', color: '#e74c3c' };
  };

  const exhaustedMembers = teamMembers.filter(m => m.isExhausted).length;
  const highStressMembers = teamMembers.filter(m => m.stressLevel === 'high').length;
  const avgTaskCompletion = Math.round(
    teamMembers.reduce((sum, m) => sum + m.taskCompletionRate, 0) / teamMembers.length
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header Stats */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Team Overview
      </Typography>

      {/* Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                  Total Members
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3498db' }}>
                  {teamMembers.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#3498db15', color: '#3498db' }}>
                <Psychology />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                  Exhausted Members
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#e74c3c' }}>
                  {exhaustedMembers}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#e74c3c15', color: '#e74c3c' }}>
                <Warning />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                  High Stress
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f39c12' }}>
                  {highStressMembers}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#f39c1215', color: '#f39c12' }}>
                <FitnessCenter />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                  Avg Task Completion
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2ecc71' }}>
                  {avgTaskCompletion}%
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#2ecc7115', color: '#2ecc71' }}>
                <Assignment />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Team Members List */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Team Members Details
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {teamMembers.map((member) => {
          const wellbeingStatus = getWellbeingStatus(member.wellbeingScore);
          
          return (
            <Paper
              key={member.id}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${member.isExhausted ? '#e74c3c' : '#2ecc71'}`,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: member.isExhausted ? '#e74c3c' : '#3498db',
                    fontSize: 24,
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>

                {/* Member Info */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    
                    {member.isExhausted && (
                      <Chip
                        icon={<Warning sx={{ fontSize: 16 }} />}
                        label="Exhausted"
                        size="small"
                        sx={{
                          bgcolor: '#e74c3c',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    
                    <Chip
                      label={`Stress: ${member.stressLevel.toUpperCase()}`}
                      size="small"
                      sx={{
                        bgcolor: getStressColor(member.stressLevel) + '20',
                        color: getStressColor(member.stressLevel),
                        fontWeight: 600,
                      }}
                    />

                    {member.trend === 'up' && (
                      <TrendingUp sx={{ color: '#2ecc71', fontSize: 20 }} />
                    )}
                    {member.trend === 'down' && (
                      <TrendingDown sx={{ color: '#e74c3c', fontSize: 20 }} />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>
                    {member.email} • Last active: {member.lastActive}
                  </Typography>

                  {/* Metrics Grid */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                      gap: 3,
                    }}
                  >
                    {/* Task Completion */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Task Completion
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {member.taskCompletionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={member.taskCompletionRate}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#ecf0f1',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: member.taskCompletionRate >= 80 ? '#2ecc71' : '#f39c12',
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>

                    {/* Wellbeing Score */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Wellbeing Score
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {member.wellbeingScore}/100
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={member.wellbeingScore}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#ecf0f1',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: wellbeingStatus.color,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>

                    {/* Logged Hours */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Logged Hours
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 14, color: '#7f8c8d' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {member.loggedHours}h
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(member.loggedHours / 45) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#ecf0f1',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: member.loggedHours > 44 ? '#e74c3c' : '#3498db',
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Action Button */}
                <Box>
                  <Tooltip title="View Details">
                    <IconButton
                      onClick={() => onViewMember(member.id)}
                      sx={{
                        bgcolor: '#3498db15',
                        color: '#3498db',
                        '&:hover': {
                          bgcolor: '#3498db',
                          color: 'white',
                        },
                      }}
                    >
                      <RemoveRedEye />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};
