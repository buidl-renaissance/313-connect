import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
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
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
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

const Section = styled.div`
  margin: 3rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
`;

const Table = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 115, 0, 0.2);
  border-radius: 16px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 1rem 1.5rem;
  background: rgba(255, 115, 0, 0.1);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ff7300;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease;
  
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

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaaaaa;
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaaaaa;
  
  p {
    margin-bottom: 2rem;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 115, 0, 0.4);
  }
`;

interface Analytics {
  totalCards: number;
  totalViews: number;
  totalShares: number;
  totalConversions: number;
  totalReferrals: number;
  recentViews: any[];
  topCards: any[];
}

export default function Analytics() {
  const router = useRouter();
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AuthGuard>
      <Head>
        <title>Analytics - 313Connect</title>
        <meta name="description" content="View your analytics" />
      </Head>

      <Container>
        <Header>
          <Logo onClick={() => router.push('/')}>313CONNECT</Logo>
          <Nav>
            <NavButton onClick={() => router.push('/dashboard')}>Dashboard</NavButton>
            <NavButton onClick={() => router.push('/offerings')}>My Offerings</NavButton>
            <NavButton onClick={() => router.push('/marketplace')}>Marketplace</NavButton>
          </Nav>
        </Header>

        <Main>
          <Title>Analytics</Title>

          {isLoading ? (
            <LoadingState>Loading analytics...</LoadingState>
          ) : !analytics || analytics.totalCards === 0 ? (
            <EmptyState>
              <h3>No analytics yet</h3>
              <p>Create some offerings and share cards to start tracking your performance!</p>
              <Button onClick={() => router.push('/offerings/create')}>
                Create Your First Offering
              </Button>
            </EmptyState>
          ) : (
            <>
              <StatsGrid>
                <StatCard>
                  <StatValue>{analytics.totalCards}</StatValue>
                  <StatLabel>Total Cards</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{analytics.totalViews}</StatValue>
                  <StatLabel>Total Views</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{analytics.totalShares}</StatValue>
                  <StatLabel>Total Shares</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{analytics.totalConversions}</StatValue>
                  <StatLabel>Conversions</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{analytics.totalReferrals}</StatValue>
                  <StatLabel>Referrals</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>
                    {analytics.totalViews > 0 
                      ? `${((analytics.totalConversions / analytics.totalViews) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </StatValue>
                  <StatLabel>Conversion Rate</StatLabel>
                </StatCard>
              </StatsGrid>

              {analytics.topCards.length > 0 && (
                <Section>
                  <SectionTitle>Top Performing Cards</SectionTitle>
                  <Table>
                    <TableHeader>
                      <div>Card</div>
                      <div>Views</div>
                      <div>Share URL</div>
                    </TableHeader>
                    {analytics.topCards.map((item: any) => (
                      <TableRow key={item.cardId}>
                        <div>{item.card?.title || 'Profile Card'}</div>
                        <div>{item.viewCount}</div>
                        <div style={{ fontSize: '0.85rem', color: '#ff7300' }}>
                          {item.card?.shareUrl}
                        </div>
                      </TableRow>
                    ))}
                  </Table>
                </Section>
              )}

              {analytics.recentViews.length > 0 && (
                <Section>
                  <SectionTitle>Recent Views</SectionTitle>
                  <Table>
                    <TableHeader>
                      <div>Card</div>
                      <div>When</div>
                      <div>Source</div>
                    </TableHeader>
                    {analytics.recentViews.map((view: any, index: number) => (
                      <TableRow key={`${view.cardId}-${index}`}>
                        <div>{view.cardId.substring(0, 8)}...</div>
                        <div>{formatDate(view.viewedAt)}</div>
                        <div style={{ fontSize: '0.85rem', color: '#aaaaaa' }}>
                          {view.referrer ? new URL(view.referrer).hostname : 'Direct'}
                        </div>
                      </TableRow>
                    ))}
                  </Table>
                </Section>
              )}
            </>
          )}
        </Main>
      </Container>
    </AuthGuard>
  );
}

