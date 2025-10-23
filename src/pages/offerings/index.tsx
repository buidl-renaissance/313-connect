import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { OfferingCard } from '@/components/OfferingCard';
import { CardGenerator } from '@/components/CardGenerator';

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

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ff7300;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 115, 0, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 115, 0, 0.4);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
  
  p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaaaaa;
  font-size: 1.1rem;
`;

interface Offering {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export default function Offerings() {
  const router = useRouter();
  const { token } = useAuth();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardGeneratorOpen, setCardGeneratorOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    if (!token) return;

    fetchOfferings();
  }, [token]);

  const fetchOfferings = async () => {
    try {
      const response = await fetch('/api/offerings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOfferings(data.offerings);
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/offerings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        fetchOfferings();
      }
    } catch (error) {
      console.error('Error toggling offering status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/offerings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchOfferings();
      }
    } catch (error) {
      console.error('Error deleting offering:', error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/offerings/${id}`);
  };

  const handleCreateCard = (offeringId: string) => {
    const offering = offerings.find(o => o.id === offeringId);
    if (offering) {
      setSelectedOffering({ id: offering.id, title: offering.title });
      setCardGeneratorOpen(true);
    }
  };

  return (
    <AuthGuard>
      <Head>
        <title>My Offerings - 313Connect</title>
        <meta name="description" content="Manage your offerings" />
      </Head>

      <Container>
        <Header>
          <Logo onClick={() => router.push('/')}>313CONNECT</Logo>
          <Nav>
            <NavButton onClick={() => router.push('/dashboard')}>Dashboard</NavButton>
            <NavButton onClick={() => router.push('/marketplace')}>Marketplace</NavButton>
            <NavButton onClick={() => router.push('/analytics')}>Analytics</NavButton>
          </Nav>
        </Header>

        <Main>
          <TitleSection>
            <Title>My Offerings</Title>
            <CreateButton onClick={() => router.push('/offerings/create')}>
              + Create New Offering
            </CreateButton>
          </TitleSection>

          {isLoading ? (
            <LoadingState>Loading your offerings...</LoadingState>
          ) : offerings.length === 0 ? (
            <EmptyState>
              <h3>No offerings yet</h3>
              <p>Create your first offering to start sharing your services and products!</p>
              <CreateButton onClick={() => router.push('/offerings/create')}>
                Create Your First Offering
              </CreateButton>
            </EmptyState>
          ) : (
            <Grid>
              {offerings.map((offering) => (
                <OfferingCard
                  key={offering.id}
                  {...offering}
                  showActions
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  onCreateCard={handleCreateCard}
                />
              ))}
            </Grid>
          )}
        </Main>

        <CardGenerator
          isOpen={cardGeneratorOpen}
          onClose={() => {
            setCardGeneratorOpen(false);
            setSelectedOffering(null);
          }}
          offeringId={selectedOffering?.id}
          offeringTitle={selectedOffering?.title}
          token={token || ''}
        />
      </Container>
    </AuthGuard>
  );
}

