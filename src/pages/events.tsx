import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
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

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  color: #ff7300;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #ff7300 0%, #ffa500 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border: 2px solid ${props => props.$active ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active
      ? 'linear-gradient(135deg, #ff8800 0%, #ffb600 100%)'
      : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #aaaaaa;
  font-size: 1.2rem;
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  box-shadow: 0 10px 30px rgba(255, 115, 0, 0.4);
  z-index: 100;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 115, 0, 0.6);
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

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

const regions = ['All', 'Midtown', 'Downtown', 'Corktown', 'Hamtramck', 'Southwest'];

export default function Events() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const url = showUpcomingOnly ? '/api/events?upcoming=true' : '/api/events';
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [showUpcomingOnly]);

  useEffect(() => {
    // Filter events by region
    if (selectedRegion === 'All') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.region === selectedRegion));
    }
  }, [selectedRegion, events]);

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      alert('Please connect your wallet to create an event');
      return;
    }
    // TODO: Implement event creation modal
    alert('Event creation coming soon!');
  };

  return (
    <>
      <Head>
        <title>Events - 313Connect</title>
        <meta name="description" content="Discover local events in Detroit" />
      </Head>

      <Container>
        <Header>
          <Logo onClick={() => router.push('/')}>313CONNECT</Logo>
          <ConnectButton />
        </Header>

        <Main>
          <PageTitle>Local Events</PageTitle>

          <Filters>
            <FilterButton
              $active={showUpcomingOnly}
              onClick={() => setShowUpcomingOnly(!showUpcomingOnly)}
            >
              {showUpcomingOnly ? 'Upcoming' : 'All Time'}
            </FilterButton>
            
            {regions.map((region) => (
              <FilterButton
                key={region}
                $active={selectedRegion === region}
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </FilterButton>
            ))}
          </Filters>

          {isLoading ? (
            <EmptyState>Loading events...</EmptyState>
          ) : filteredEvents.length > 0 ? (
            <Grid>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </Grid>
          ) : (
            <EmptyState>
              No events found
              {selectedRegion !== 'All' && ` in ${selectedRegion}`}
            </EmptyState>
          )}

          <CreateButton onClick={handleCreateEvent}>
            + Create Event
          </CreateButton>
        </Main>
      </Container>
    </>
  );
}

