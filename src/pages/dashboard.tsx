import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { ProfileCard } from '@/components/ProfileCard';
import { EventCard } from '@/components/EventCard';
import { ConnectButton } from '@/components/ConnectButton';

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

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #ff7300;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const Stats = styled.div`
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
`;

const Button = styled.button`
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 115, 0, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaaaaa;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const ActionCard = styled.button`
  background: rgba(255, 115, 0, 0.1);
  border: 1px solid rgba(255, 115, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
  text-align: left;
  
  &:hover {
    background: rgba(255, 115, 0, 0.2);
    transform: translateY(-2px);
  }
  
  div:first-child {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  div:nth-child(2) {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  div:last-child {
    font-size: 0.85rem;
    color: #aaaaaa;
  }
`;

interface Profile {
  displayName: string | null;
  bio: string | null;
  region: string | null;
  verificationStatus: string;
  identity?: {
    number: string;
    fullNumber: string;
  };
}

interface Connection {
  id: string;
  userId: string;
  identity?: {
    number: string;
    fullNumber: string;
  };
  profile?: {
    displayName: string | null;
    region: string | null;
  };
  status: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  region: string | null;
  startTime: Date;
  endTime: Date | null;
  creator: {
    identity?: {
      fullNumber: string;
    };
    profile?: {
      displayName: string | null;
    };
  };
}

export default function Dashboard() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;

      try {
        // Fetch profile
        const profileRes = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.profile);
        }

        // Fetch connections
        const connectionsRes = await fetch('/api/connections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const connectionsData = await connectionsRes.json();
        if (connectionsData.success) {
          setConnections(connectionsData.connections);
        }

        // Fetch upcoming events
        const eventsRes = await fetch('/api/events?upcoming=true');
        const eventsData = await eventsRes.json();
        if (eventsData.success) {
          setUpcomingEvents(eventsData.events.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (isLoading) {
    return (
      <Container>
        <EmptyState>Loading...</EmptyState>
      </Container>
    );
  }

  return (
    <AuthGuard>
      <Head>
        <title>Dashboard - 313Connect</title>
        <meta name="description" content="Your 313Connect dashboard" />
      </Head>

      <Container>
        <Header>
          <Logo onClick={() => router.push('/')}>313CONNECT</Logo>
          <ConnectButton />
        </Header>

        <Main>
          <Section>
            <SectionTitle>Quick Actions</SectionTitle>
            <QuickActions>
              <ActionCard onClick={() => router.push('/offerings/create')}>
                <div>📦</div>
                <div>Create Offering</div>
                <div>Share what you offer</div>
              </ActionCard>
              <ActionCard onClick={() => router.push('/marketplace')}>
                <div>🌍</div>
                <div>Marketplace</div>
                <div>Discover nearby</div>
              </ActionCard>
              <ActionCard onClick={() => router.push('/analytics')}>
                <div>📊</div>
                <div>Analytics</div>
                <div>Track performance</div>
              </ActionCard>
              <ActionCard onClick={() => router.push('/offerings')}>
                <div>📋</div>
                <div>My Offerings</div>
                <div>Manage services</div>
              </ActionCard>
            </QuickActions>
          </Section>

          <Section>
            <SectionTitle>Your Profile</SectionTitle>
            {profile && (
              <ProfileCard
                identity={profile.identity}
                displayName={profile.displayName}
                bio={profile.bio}
                region={profile.region}
                verificationStatus={profile.verificationStatus}
              />
            )}
          </Section>

          <Stats>
            <StatCard>
              <StatValue>{connections.length}</StatValue>
              <StatLabel>Connections</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{upcomingEvents.length}</StatValue>
              <StatLabel>Upcoming Events</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{profile?.verificationStatus === 'verified' ? '✓' : '—'}</StatValue>
              <StatLabel>Verification Status</StatLabel>
            </StatCard>
          </Stats>

          <Section>
            <SectionTitle>Upcoming Events</SectionTitle>
            {upcomingEvents.length > 0 ? (
              <Grid>
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </Grid>
            ) : (
              <EmptyState>No upcoming events</EmptyState>
            )}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Button onClick={() => router.push('/events')}>
                Browse All Events
              </Button>
            </div>
          </Section>

          <Section>
            <SectionTitle>Your Connections</SectionTitle>
            {connections.length > 0 ? (
              <Grid>
                {connections
                  .filter((conn) => conn.status === 'accepted')
                  .map((conn) => (
                    <ProfileCard
                      key={conn.id}
                      identity={conn.identity}
                      displayName={conn.profile?.displayName}
                      region={conn.profile?.region}
                    />
                  ))}
              </Grid>
            ) : (
              <EmptyState>No connections yet</EmptyState>
            )}
          </Section>
        </Main>
      </Container>
    </AuthGuard>
  );
}

