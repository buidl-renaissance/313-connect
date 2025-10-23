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
  align-items: center;
  
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

const GoLiveButton = styled.button<{ $isLive: boolean }>`
  background: ${props => 
    props.$isLive 
      ? 'linear-gradient(135deg, #ff4444 0%, #ff6666 100%)' 
      : 'linear-gradient(135deg, #00ff88 0%, #00dd77 100%)'
  };
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${props => props.$isLive ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(255, 68, 68, 0.8);
    }
  }
  
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #aaaaaa;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const StatusBanner = styled.div<{ $isLive: boolean }>`
  background: ${props => 
    props.$isLive 
      ? 'rgba(0, 255, 136, 0.1)' 
      : 'rgba(255, 115, 0, 0.1)'
  };
  border: 1px solid ${props => 
    props.$isLive 
      ? 'rgba(0, 255, 136, 0.3)' 
      : 'rgba(255, 115, 0, 0.3)'
  };
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 115, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 115, 0, 0.4);
    transform: translateY(-2px);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  color: #ff7300;
  font-family: monospace;
`;

const Distance = styled.div`
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const UserName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0.5rem 0;
`;

const UserRegion = styled.div`
  color: #aaaaaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const OfferingTag = styled.div`
  display: inline-block;
  background: rgba(255, 115, 0, 0.2);
  color: #ff7300;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const OfferingTitle = styled.div`
  color: #ffffff;
  font-weight: 600;
  margin: 0.5rem 0;
`;

const ConnectButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 115, 0, 0.3);
  }
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

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaaaaa;
  font-size: 1.1rem;
`;

const LocationNote = styled.div`
  text-align: center;
  padding: 2rem;
  color: #aaaaaa;
  font-size: 0.9rem;
  margin-top: 2rem;
`;

interface NearbyUser {
  userId: string;
  distance: string;
  profile: any;
  identity: any;
  offering: any;
}

export default function Marketplace() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    checkLiveStatus();
    getUserLocation();
  }, [token]);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyUsers();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchNearbyUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [userLocation]);

  const checkLiveStatus = async () => {
    try {
      const response = await fetch('/api/marketplace/go-live', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setIsLive(data.isLive || false);
      }
    } catch (error) {
      console.error('Error checking live status:', error);
    }
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Location access denied. Please enable location services.');
          setIsLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  };

  const fetchNearbyUsers = async () => {
    if (!userLocation) return;

    try {
      const response = await fetch(
        `/api/marketplace/nearby?latitude=${userLocation.lat}&longitude=${userLocation.lon}&radius=25`
      );

      const data = await response.json();
      if (data.success) {
        setNearbyUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    }
  };

  const toggleGoLive = async () => {
    if (!userLocation) {
      alert('Location is required to go live');
      return;
    }

    try {
      if (isLive) {
        // Stop being live
        const response = await fetch('/api/marketplace/go-live', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLive(false);
        }
      } else {
        // Go live
        const response = await fetch('/api/marketplace/go-live', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude: userLocation.lat,
            longitude: userLocation.lon,
            visibilityMode: 'all',
          }),
        });

        if (response.ok) {
          setIsLive(true);
          fetchNearbyUsers();
        }
      }
    } catch (error) {
      console.error('Error toggling live status:', error);
      alert('Failed to update live status');
    }
  };

  return (
    <AuthGuard>
      <Head>
        <title>Marketplace - 313Connect</title>
        <meta name="description" content="Discover nearby offerings" />
      </Head>

      <Container>
        <Header>
          <Logo onClick={() => router.push('/')}>313CONNECT</Logo>
          <Nav>
            <NavButton onClick={() => router.push('/dashboard')}>Dashboard</NavButton>
            <NavButton onClick={() => router.push('/offerings')}>My Offerings</NavButton>
            <NavButton onClick={() => router.push('/analytics')}>Analytics</NavButton>
            <GoLiveButton 
              $isLive={isLive} 
              onClick={toggleGoLive}
              disabled={!userLocation}
            >
              {isLive ? '🔴 Stop Live' : '🟢 Go Live'}
            </GoLiveButton>
          </Nav>
        </Header>

        <Main>
          <Title>Marketplace</Title>
          <Subtitle>Discover people and offerings nearby</Subtitle>

          {isLive && (
            <StatusBanner $isLive={true}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#00ff88' }}>
                🟢 You are live! Others can see you on the marketplace.
              </div>
            </StatusBanner>
          )}

          {locationError && (
            <StatusBanner $isLive={false}>
              <div style={{ fontSize: '1rem', color: '#ff7300' }}>
                ⚠️ {locationError}
              </div>
            </StatusBanner>
          )}

          {isLoading ? (
            <LoadingState>Getting your location...</LoadingState>
          ) : !userLocation ? (
            <EmptyState>
              <h3>Location Required</h3>
              <p>Please enable location services to use the marketplace.</p>
            </EmptyState>
          ) : nearbyUsers.length === 0 ? (
            <EmptyState>
              <h3>No one nearby yet</h3>
              <p>Be the first to go live in your area!</p>
            </EmptyState>
          ) : (
            <>
              <Grid>
                {nearbyUsers.map((user) => (
                  <UserCard key={user.userId}>
                    <UserHeader>
                      <UserNumber>{user.identity?.fullNumber || '313#---'}</UserNumber>
                      <Distance>{user.distance} mi</Distance>
                    </UserHeader>
                    
                    {user.profile?.displayName && (
                      <UserName>{user.profile.displayName}</UserName>
                    )}
                    
                    {user.profile?.region && (
                      <UserRegion>📍 {user.profile.region}</UserRegion>
                    )}

                    {user.offering && (
                      <>
                        <OfferingTag>{user.offering.category}</OfferingTag>
                        <OfferingTitle>{user.offering.title}</OfferingTitle>
                        {user.offering.price && (
                          <div style={{ color: '#ff7300', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            {user.offering.price}
                          </div>
                        )}
                      </>
                    )}

                    <ConnectButton onClick={() => router.push(`/profile/${user.userId}`)}>
                      View Profile
                    </ConnectButton>
                  </UserCard>
                ))}
              </Grid>

              <LocationNote>
                Showing people within 25 miles • Updates every 30 seconds
              </LocationNote>
            </>
          )}
        </Main>
      </Container>
    </AuthGuard>
  );
}

