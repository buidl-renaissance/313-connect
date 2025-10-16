import Head from "next/head";
import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { ConnectButton } from "@/components/ConnectButton";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
  overflow-x: hidden;
`;

const Header = styled.header`
  padding: 2rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 115, 0, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -2px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Hero = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 115, 0, 0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.5;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.8;
    }
  }
`;

const Tagline = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #aaaaaa;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const DialPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 1rem;
  margin: 3rem auto;
  max-width: 340px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 80px);
    gap: 0.8rem;
  }
  
  .zero-button {
    grid-column: 2 / 3;
  }
  
  .backspace-button {
    grid-column: 3 / 4;
  }
`;

const DialButton = styled.button<{ $isActive?: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid ${props => props.$isActive ? '#ff7300' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.$isActive 
    ? 'linear-gradient(135deg, rgba(255, 115, 0, 0.3) 0%, rgba(255, 165, 0, 0.3) 100%)' 
    : 'rgba(255, 255, 255, 0.05)'};
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$isActive ? '0 0 30px rgba(255, 115, 0, 0.5)' : 'none'};
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(255, 115, 0, 0.3) 0%, rgba(255, 165, 0, 0.3) 100%);
    border-color: #ff7300;
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 115, 0, 0.5);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 1.6rem;
  }
`;

const Section = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #ff7300;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 115, 0, 0.3);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 115, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const FeatureDescription = styled.p`
  color: #aaaaaa;
  line-height: 1.6;
  font-size: 1rem;
`;

const IDExample = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #ff7300;
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  margin: 3rem auto;
  max-width: 600px;
  box-shadow: 0 0 50px rgba(255, 115, 0, 0.2);
`;

const IDNumber = styled.div`
  font-size: 4rem;
  font-weight: 900;
  color: #ff7300;
  margin-bottom: 1rem;
  font-family: monospace;
  letter-spacing: 4px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: 2px;
  }
`;

const IDLabel = styled.div`
  font-size: 1.2rem;
  color: #aaaaaa;
  margin-bottom: 0.5rem;
`;

const IDRegion = styled.div`
  font-size: 1rem;
  color: #ffffff;
  background: rgba(255, 115, 0, 0.2);
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  margin-top: 1rem;
`;

const NumberDisplay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 115, 0, 0.5);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  margin: 2rem auto;
  max-width: 400px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DisplayedNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #ff7300;
  font-family: monospace;
  letter-spacing: 4px;
  margin-bottom: 1rem;
  min-height: 50px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    letter-spacing: 2px;
  }
`;

const DisplayLabel = styled.div`
  font-size: 1rem;
  color: #aaaaaa;
  margin-bottom: 0.5rem;
`;

const AvailabilityStatus = styled.div<{ $available?: boolean | null }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => 
    props.$available === null ? '#aaaaaa' : 
    props.$available ? '#00ff88' : '#ff4444'};
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: ${props => 
    props.$available === null ? 'rgba(255, 255, 255, 0.05)' :
    props.$available ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)'};
  border-radius: 12px;
  transition: all 0.3s ease;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, #ff7300 0%, #ffa500 100%)'};
  color: #ffffff;
  border: ${props => props.$variant === 'secondary' ? '2px solid rgba(255, 255, 255, 0.3)' : 'none'};
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.$variant === 'secondary'
      ? 'rgba(255, 255, 255, 0.15)'
      : 'linear-gradient(135deg, #ff8800 0%, #ffb600 100%)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  color: #ffffff;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255, 115, 0, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 115, 0, 0.5);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 115, 0, 0.2);
  color: #aaaaaa;
  font-size: 0.9rem;
`;

const Timeline = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 2rem;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const TimelineMarker = styled.div`
  min-width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 0 20px rgba(255, 115, 0, 0.5);
`;

const TimelineContent = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  
  h4 {
    color: #ff7300;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }
  
  p {
    color: #aaaaaa;
    line-height: 1.6;
  }
`;

export default function Home() {
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [typedNumber, setTypedNumber] = useState<string>('');
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  
  const handleNumberClick = (num: number) => {
    // Limit to 6 digits
    if (typedNumber.length >= 6) return;
    setTypedNumber(prev => prev + num);
    setAvailability(null);
    setAvailabilityMessage('');
  };
  
  const handleBackspace = () => {
    setTypedNumber(prev => prev.slice(0, -1));
    setAvailability(null);
    setAvailabilityMessage('');
  };
  
  const handleClear = () => {
    setTypedNumber('');
    setAvailability(null);
    setAvailabilityMessage('');
  };
  
  const handleCheckAvailability = async () => {
    if (!typedNumber) return;
    
    setIsChecking(true);
    try {
      const response = await fetch('/api/identities/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: typedNumber }),
      });
      
      const data = await response.json();
      setAvailability(data.available);
      setAvailabilityMessage(data.message);
    } catch {
      setAvailabilityMessage('Error checking availability');
      setAvailability(null);
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleClaimNumber = async () => {
    // Check if user has typed a number
    if (!typedNumber) {
      alert('Please enter a number using the dialpad');
      return;
    }
    
    // Check if user has verified availability
    if (availability === null) {
      alert('Please check if the number is available first');
      return;
    }
    
    // Check if number is actually available
    if (!availability) {
      alert('This number is already claimed. Please choose a different number.');
      return;
    }
    
    // Check authentication
    if (!isAuthenticated) {
      alert('Please connect your wallet first to claim a number');
      return;
    }
    
    setIsClaiming(true);
    try {
      const response = await fetch('/api/identities/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ number: typedNumber }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        alert(data.error || 'Failed to claim number');
      }
    } catch {
      alert('Error claiming number');
    } finally {
      setIsClaiming(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>313Connect - Your Local Network, Rooted in Detroit</title>
        <meta name="description" content="Your local network — verified by connection, rooted in Detroit." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container>
        <Header>
          <Logo>313CONNECT</Logo>
          <ConnectButton />
        </Header>
        
        <Hero>
          <Tagline>Your local network — verified by connection, rooted in Detroit.</Tagline>
          <Subtitle>
            A hyperlocal, phone-inspired network where users claim unique numeric identifiers tied to the 313 Detroit code. 
            Your number is your name, your connections are real, and your privacy is built in.
          </Subtitle>
          
          <NumberDisplay>
            <DisplayLabel>Check Availability</DisplayLabel>
            <DisplayedNumber>
              {typedNumber ? `313-${typedNumber}` : '313-___'}
            </DisplayedNumber>
            {availabilityMessage && (
              <AvailabilityStatus $available={availability}>
                {availabilityMessage}
              </AvailabilityStatus>
            )}
            <ButtonRow>
              <ActionButton 
                onClick={handleCheckAvailability}
                disabled={!typedNumber || isChecking}
              >
                {isChecking ? 'Checking...' : 'Check Availability'}
              </ActionButton>
              <ActionButton 
                $variant="secondary"
                onClick={handleClear}
                disabled={!typedNumber}
              >
                Clear
              </ActionButton>
            </ButtonRow>
          </NumberDisplay>
          
          <DialPad>
            {/* Numbers 1-9 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <DialButton
                key={num}
                $isActive={activeNumber === num}
                onMouseEnter={() => setActiveNumber(num)}
                onMouseLeave={() => setActiveNumber(null)}
                onClick={() => handleNumberClick(num)}
              >
                {num}
              </DialButton>
            ))}
            
            {/* Empty space */}
            <div style={{ width: '100px' }} />
            
            {/* Zero button */}
            <DialButton
              className="zero-button"
              $isActive={activeNumber === 0}
              onMouseEnter={() => setActiveNumber(0)}
              onMouseLeave={() => setActiveNumber(null)}
              onClick={() => handleNumberClick(0)}
            >
              0
            </DialButton>
            
            {/* Backspace button */}
            <DialButton
              className="backspace-button"
              onClick={handleBackspace}
              disabled={!typedNumber}
            >
              ⌫
            </DialButton>
          </DialPad>
          
          <CTAButton onClick={handleClaimNumber} disabled={isClaiming}>
            {isClaiming ? 'Claiming...' : 'Claim Your Number'}
          </CTAButton>
        </Hero>
        
        <Section>
          <SectionTitle>Your Connect ID</SectionTitle>
          
          <IDExample>
            <IDLabel>Your Connect ID</IDLabel>
            <IDNumber>313-562</IDNumber>
            <IDRegion>📍 Midtown</IDRegion>
          </IDExample>
          
          <Subtitle style={{ marginTop: '2rem' }}>
            Every user selects a unique number in the 313Connect namespace. That number becomes your pseudonymous 
            decentralized identifier. Once claimed, numbers are permanently reserved to prevent impersonation.
          </Subtitle>
        </Section>
        
        <Section>
          <SectionTitle>How It Works</SectionTitle>
          
          <Timeline>
            <TimelineItem>
              <TimelineMarker>1</TimelineMarker>
              <TimelineContent>
                <h4>Pick Your Number</h4>
                <p>Choose a unique number in the 313 namespace. Short numbers are rare and collectible — early claimants become founding members.</p>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineMarker>2</TimelineMarker>
              <TimelineContent>
                <h4>Verify Locally</h4>
                <p>Activate your number by verifying within a 5-mile radius. Your identity is rooted in real-world presence.</p>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineMarker>3</TimelineMarker>
              <TimelineContent>
                <h4>Connect IRL</h4>
                <p>Exchange numbers like trading cards. Discover nearby users via Bluetooth. Build your local network through verified connections.</p>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineMarker>4</TimelineMarker>
              <TimelineContent>
                <h4>Join Your Community</h4>
                <p>Create regional sub-IDs tied to specific neighborhoods. Attend local events, discover what&apos;s happening in your area.</p>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Section>
        
        <Section>
          <SectionTitle>Features</SectionTitle>
          
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>🔢</FeatureIcon>
              <FeatureTitle>Unique Identity</FeatureTitle>
              <FeatureDescription>
                Claim your permanent numeric ID. Simple, memorable, and uniquely yours. From short legacy numbers like 3131 to custom combinations.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📍</FeatureIcon>
              <FeatureTitle>Hyperlocal</FeatureTitle>
              <FeatureDescription>
                Join regional communities tied to Detroit neighborhoods — Midtown, Hamtramck, Corktown. Your network starts with who&apos;s around you.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🔒</FeatureIcon>
              <FeatureTitle>Privacy First</FeatureTitle>
              <FeatureDescription>
                Decentralized identity powered by cryptography. Your data stays local, your connections stay private, your identity stays secure.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📱</FeatureIcon>
              <FeatureTitle>Bluetooth Discovery</FeatureTitle>
              <FeatureDescription>
                Discover nearby 313 users in real-time. Connect instantly via BLE without sharing personal information.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🎫</FeatureIcon>
              <FeatureTitle>Local Events</FeatureTitle>
              <FeatureDescription>
                Find and attend community events organized by region. Meet your neighbors IRL and build real connections.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>Founding Members</FeatureTitle>
              <FeatureDescription>
                Early claimants of short IDs get rare, collectible status. Be part of Detroit&apos;s digital legacy from the beginning.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </Section>
        
        <Section style={{ textAlign: 'center', paddingBottom: '6rem' }}>
          <SectionTitle>Detroit Has a Heartbeat</SectionTitle>
          <Subtitle>
            It&apos;s 313Connect. A new kind of local network where your number is your name, 
            your connections are real, and your privacy is built in.
          </Subtitle>
          <Subtitle style={{ marginTop: '2rem', fontSize: '1.5rem', fontWeight: 600, color: '#ff7300' }}>
            Pick your number. Meet in person. Stay connected — privately.
          </Subtitle>
          <div style={{ marginTop: '3rem' }}>
            <CTAButton>Join the Network</CTAButton>
          </div>
        </Section>
        
        <Footer>
          <p>313Connect — Rooted in Detroit, Built for Community</p>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
            A hyperlocal decentralized identity network
          </p>
        </Footer>
      </Container>
    </>
  );
}
