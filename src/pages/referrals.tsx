import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
`;

const Header = styled.header`
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 115, 0, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 115, 0, 0.3);
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 115, 0, 0.2);
    border-color: rgba(255, 115, 0, 0.5);
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ff7300;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #ff7300;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #aaaaaa;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ReferralsList = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 115, 0, 0.2);
  border-radius: 16px;
  overflow: hidden;
`;

const ReferralItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const ReferralUser = styled.div`
  h4 {
    color: #ffffff;
    font-size: 1.1rem;
    margin: 0 0 0.25rem;
  }
  
  p {
    color: #aaaaaa;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => 
    props.$status === 'completed' ? 'rgba(0, 255, 136, 0.2)' :
    props.$status === 'pending' ? 'rgba(255, 170, 0, 0.2)' :
    'rgba(255, 68, 68, 0.2)'
  };
  color: ${props => 
    props.$status === 'completed' ? '#00ff88' :
    props.$status === 'pending' ? '#ffaa00' :
    '#ff4444'
  };
`;

const Date = styled.div`
  color: #888888;
  font-size: 0.9rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaaaaa;
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #aaaaaa;
  
  h3 {
    font-size: 1.5rem;
    color: #ffffff;
    margin-bottom: 1rem;
  }
`;

interface Referral {
  id: string;
  status: string;
  createdAt: Date;
  referredUser?: {
    profile: {
      displayName: string | null;
      region: string | null;
    } | null;
    identity: {
      fullNumber: string;
    } | null;
  } | null;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
}

export default function Referrals() {
  const router = useRouter();
  const { token } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReferrals = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/referrals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setReferrals(data.referrals);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AuthGuard>
      <Head>
        <title>Referrals - 313Connect</title>
        <meta name="description" content="Track your referrals" />
      </Head>

      <Container>
        <Header>
          <Logo onClick={() => router.push('/')}>313CONNECT</Logo>
          <Nav>
            <NavButton onClick={() => router.push('/dashboard')}>Dashboard</NavButton>
            <NavButton onClick={() => router.push('/offerings')}>My Offerings</NavButton>
            <NavButton onClick={() => router.push('/analytics')}>Analytics</NavButton>
            <NavButton onClick={() => router.push('/marketplace')}>Marketplace</NavButton>
          </Nav>
        </Header>

        <Main>
          <Title>Your Referrals</Title>

          {isLoading ? (
            <LoadingState>Loading referrals...</LoadingState>
          ) : (
            <>
              <StatsGrid>
                <StatCard>
                  <StatValue>{stats.total}</StatValue>
                  <StatLabel>Total Referrals</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.completed}</StatValue>
                  <StatLabel>Completed</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.pending}</StatValue>
                  <StatLabel>Pending</StatLabel>
                </StatCard>
              </StatsGrid>

              {referrals.length === 0 ? (
                <EmptyState>
                  <h3>No referrals yet</h3>
                  <p>Share your cards to start building your referral network!</p>
                </EmptyState>
              ) : (
                <ReferralsList>
                  {referrals.map((referral) => (
                    <ReferralItem key={referral.id}>
                      <ReferralUser>
                        <h4>
                          {referral.referredUser?.profile?.displayName || 
                           referral.referredUser?.identity?.fullNumber || 
                           'Anonymous User'}
                        </h4>
                        {referral.referredUser?.profile?.region && (
                          <p>📍 {referral.referredUser.profile.region}</p>
                        )}
                      </ReferralUser>
                      <StatusBadge $status={referral.status}>
                        {referral.status}
                      </StatusBadge>
                      <Date>{formatDate(referral.createdAt)}</Date>
                    </ReferralItem>
                  ))}
                </ReferralsList>
              )}
            </>
          )}
        </Main>
      </Container>
    </AuthGuard>
  );
}

