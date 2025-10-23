import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
  padding: 2rem 1rem;
`;

const Card = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid rgba(255, 115, 0, 0.3);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 115, 0, 0.2);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Number = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #ff7300;
  font-family: monospace;
  letter-spacing: 3px;
  margin: 1rem 0;
`;

const Name = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0.5rem 0;
`;

const Tagline = styled.p`
  font-size: 1.1rem;
  color: #aaaaaa;
  margin: 0.5rem 0;
  font-style: italic;
`;

const Region = styled.div`
  display: inline-block;
  background: rgba(255, 115, 0, 0.2);
  color: #ff7300;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const Section = styled.div`
  margin: 2rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ff7300;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const OfferingCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 115, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const OfferingTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem;
`;

const OfferingCategory = styled.div`
  display: inline-block;
  background: rgba(255, 115, 0, 0.2);
  color: #ff7300;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const OfferingDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin: 1rem 0;
`;

const OfferingPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff7300;
  margin: 1rem 0;
`;

const ContactInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  
  div {
    margin: 0.75rem 0;
    color: #cccccc;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    
    a {
      color: #ff7300;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Bio = styled.p`
  color: #cccccc;
  line-height: 1.8;
  font-size: 1rem;
  margin: 1rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => 
    props.$variant === 'secondary' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'linear-gradient(135deg, #ff7300 0%, #ffa500 100%)'
  };
  color: #ffffff;
  border: ${props => 
    props.$variant === 'secondary' 
      ? '1px solid rgba(255, 255, 255, 0.2)' 
      : 'none'
  };
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaaaaa;
  font-size: 1.1rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  
  h2 {
    color: #ff4444;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #aaaaaa;
    font-size: 1.1rem;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 115, 0, 0.2);
  color: #666666;
  font-size: 0.9rem;
`;

interface CardData {
  card: any;
  user: any;
  profile: any;
  identity: any;
  offering: any;
}

export default function PublicCard() {
  const router = useRouter();
  const { shareUrl } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);

  useEffect(() => {
    if (!shareUrl) return;

    fetchCard();
    trackView();
  }, [shareUrl]);

  const fetchCard = async () => {
    try {
      const response = await fetch(`/api/cards/${shareUrl}`);
      const data = await response.json();

      if (data.success) {
        setCardData(data);
      } else {
        setError(data.error || 'Card not found');
      }
    } catch (err) {
      console.error('Error fetching card:', err);
      setError('Failed to load card');
    } finally {
      setIsLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await fetch(`/api/cards/${shareUrl}/view`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const handleConvert = async (type: string) => {
    try {
      await fetch(`/api/cards/${shareUrl}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversionType: type }),
      });
    } catch (err) {
      console.error('Error tracking conversion:', err);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Card>
          <LoadingState>Loading card...</LoadingState>
        </Card>
      </Container>
    );
  }

  if (error || !cardData) {
    return (
      <Container>
        <Card>
          <ErrorState>
            <h2>Card Not Found</h2>
            <p>{error || 'This card does not exist or has been removed.'}</p>
            <Link href="/">
              <Button style={{ marginTop: '2rem' }}>Go to Homepage</Button>
            </Link>
          </ErrorState>
        </Card>
      </Container>
    );
  }

  const { profile, identity, offering } = cardData;

  return (
    <>
      <Head>
        <title>
          {profile?.displayName || identity?.fullNumber || 'Profile'} - 313Connect
        </title>
        <meta 
          name="description" 
          content={profile?.tagline || profile?.bio || 'Connect with me on 313Connect'} 
        />
      </Head>

      <Container>
        <Card>
          <Header>
            <Logo>313 CONNECT</Logo>
            {identity && <Number>{identity.fullNumber}</Number>}
            {profile?.displayName && <Name>{profile.displayName}</Name>}
            {profile?.tagline && <Tagline>{profile.tagline}</Tagline>}
            {profile?.region && <Region>📍 {profile.region}</Region>}
          </Header>

          {offering && (
            <Section>
              <SectionTitle>Offering</SectionTitle>
              <OfferingCard>
                <OfferingCategory>{offering.category}</OfferingCategory>
                <OfferingTitle>{offering.title}</OfferingTitle>
                {offering.description && (
                  <OfferingDescription>{offering.description}</OfferingDescription>
                )}
                {offering.price && <OfferingPrice>{offering.price}</OfferingPrice>}
              </OfferingCard>
            </Section>
          )}

          {profile?.bio && (
            <Section>
              <SectionTitle>About</SectionTitle>
              <Bio>{profile.bio}</Bio>
            </Section>
          )}

          <Section>
            <SectionTitle>Contact</SectionTitle>
            <ContactInfo>
              {(offering?.contactEmail || profile?.contactEmail) && (
                <div>
                  📧 <a href={`mailto:${offering?.contactEmail || profile.contactEmail}`}
                       onClick={() => handleConvert('contact')}>
                    {offering?.contactEmail || profile.contactEmail}
                  </a>
                </div>
              )}
              {(offering?.contactPhone || profile?.contactPhone) && (
                <div>
                  📞 <a href={`tel:${offering?.contactPhone || profile.contactPhone}`}
                       onClick={() => handleConvert('contact')}>
                    {offering?.contactPhone || profile.contactPhone}
                  </a>
                </div>
              )}
            </ContactInfo>
          </Section>

          <ActionButtons>
            <Button onClick={() => {
              handleConvert('connection');
              router.push('/');
            }}>
              Connect on 313Connect
            </Button>
            <Button 
              $variant="secondary"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out this 313Connect card!&url=${window.location.href}`, '_blank')}
            >
              Share This Card
            </Button>
          </ActionButtons>

          <Footer>
            <p>Powered by 313Connect</p>
            <p>
              <Link href="/" style={{ color: '#ff7300', textDecoration: 'none' }}>
                Create your own card →
              </Link>
            </p>
          </Footer>
        </Card>
      </Container>
    </>
  );
}

