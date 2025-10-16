import Head from "next/head";
import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
  overflow-x: hidden;
`;

const Header = styled.header`
  padding: 2rem 2rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 115, 0, 0.2);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Hero = styled.section`
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(255, 115, 0, 0.08) 0%, transparent 70%);
    animation: pulse 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.5;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.8;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    min-height: calc(100vh - 80px);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 500px;
  width: 100%;
  padding: 0 1rem;
  
  @media (max-width: 480px) {
    padding: 0 0.5rem;
    max-width: 100%;
  }
`;

const DialPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem auto;
  width: 100%;
  max-width: 320px;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    margin: 1.5rem auto;
  }
  
  @media (max-width: 360px) {
    gap: 0.6rem;
  }
  
  .zero-button {
    grid-column: 2 / 3;
  }
  
  .backspace-button {
    grid-column: 3 / 4;
  }
`;

const DialButton = styled.button<{ $isActive?: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  max-width: 100px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$isActive 
    ? 'rgba(255, 115, 0, 0.25)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  
  &:hover:not(:disabled) {
    background: rgba(255, 115, 0, 0.2);
    transform: scale(1.02);
  }
  
  &:active:not(:disabled) {
    background: rgba(255, 115, 0, 0.3);
    transform: scale(0.97);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    max-width: 90px;
  }
  
  @media (max-width: 360px) {
    max-width: 80px;
  }
`;

const ButtonNumber = styled.span`
  font-size: clamp(1.8rem, 5vw, 2.2rem);
  font-weight: 300;
  line-height: 1;
  margin-bottom: 0.15rem;
`;

const ButtonLetters = styled.span`
  font-size: clamp(0.5rem, 1.5vw, 0.65rem);
  font-weight: 500;
  letter-spacing: 0.1em;
  opacity: 0.6;
  text-transform: uppercase;
`;

const Section = styled.section`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #ff7300 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #aaaaaa;
  margin: 0 auto 4rem;
  max-width: 700px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 3rem;
  }
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.div`
  text-align: center;
  padding: 2rem 1.5rem;
  background: rgba(255, 115, 0, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 115, 0, 0.2);
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0 auto 1rem;
  color: #ffffff;
`;

const StepTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  color: #aaaaaa;
  line-height: 1.5;
  margin: 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 115, 0, 0.2);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 115, 0, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(255, 115, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff7300;
  margin: 0 0 0.75rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #cccccc;
  line-height: 1.6;
  margin: 0;
`;


const NumberDisplay = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 115, 0, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 12px;
    margin-bottom: 1.25rem;
  }
`;

const NumberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
`;

const DisplayedNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #ff7300;
  font-family: monospace;
  letter-spacing: 5px;
  min-height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
    letter-spacing: 3px;
    min-height: 50px;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    letter-spacing: 2px;
    min-height: 45px;
  }
  
  @media (max-width: 360px) {
    font-size: 1.75rem;
    letter-spacing: 1px;
  }
`;

const StatusIndicator = styled.div<{ $status: 'checking' | 'available' | 'unavailable' | null }>`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.$status === 'checking' && `
    animation: spin 1s linear infinite;
  `}
  
  ${props => props.$status === 'available' && `
    color: #00ff88;
  `}
  
  ${props => props.$status === 'unavailable' && `
    color: #ff4444;
  `}
  
  @keyframes spin {
    from {
      transform: translateY(-50%) rotate(0deg);
    }
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    right: 0.5rem;
  }
`;

const DisplayLabel = styled.div`
  font-size: 0.9rem;
  color: #888888;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ClaimButton = styled.button<{ $show?: boolean }>`
  width: 100%;
  max-width: 280px;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  color: #ffffff;
  border: none;
  padding: 1.2rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  cursor: ${props => props.$show ? 'pointer' : 'default'};
  transition: all 0.4s ease;
  margin: 1.5rem auto 0;
  display: block;
  opacity: ${props => props.$show ? '1' : '0'};
  pointer-events: ${props => props.$show ? 'auto' : 'none'};
  box-shadow: 0 10px 30px rgba(255, 115, 0, 0.4);
  animation: ${props => props.$show ? 'glow 2s ease-in-out infinite' : 'none'};
  
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 10px 30px rgba(255, 115, 0, 0.4), 0 0 20px rgba(255, 115, 0, 0.3);
    }
    50% {
      box-shadow: 0 10px 40px rgba(255, 115, 0, 0.6), 0 0 30px rgba(255, 115, 0, 0.5);
    }
  }
  
  &:hover:not(:disabled) {
    transform: ${props => props.$show ? 'translateY(-2px)' : 'none'};
    background: linear-gradient(135deg, #ff8800 0%, #ffb600 100%);
    box-shadow: ${props => props.$show ? '0 15px 50px rgba(255, 115, 0, 0.6), 0 0 40px rgba(255, 115, 0, 0.4)' : 'none'};
  }
  
  &:active:not(:disabled) {
    transform: ${props => props.$show ? 'translateY(0)' : 'none'};
  }
  
  @media (max-width: 480px) {
    padding: 1.1rem 1.5rem;
    font-size: 1rem;
    max-width: 100%;
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


// Phone keypad letter mapping (like iPhone)
const KEYPAD_LETTERS: Record<number, string> = {
  2: 'ABC',
  3: 'DEF',
  4: 'GHI',
  5: 'JKL',
  6: 'MNO',
  7: 'PQRS',
  8: 'TUV',
  9: 'WXYZ',
};

export default function Home() {
  const router = useRouter();
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [typedNumber, setTypedNumber] = useState<string>('');
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const checkAvailability = useCallback(async () => {
    if (!typedNumber) return;
    
    setIsChecking(true);
    setAvailability(null);
    
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
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailability(null);
    } finally {
      setIsChecking(false);
    }
  }, [typedNumber]);
  
  // Auto-check availability when number changes
  useEffect(() => {
    if (!typedNumber) {
      setAvailability(null);
      return;
    }
    
    // Debounce the check
    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [typedNumber, checkAvailability]);
  
  const handleNumberClick = (num: number) => {
    // Limit to 6 digits
    if (typedNumber.length >= 6) return;
    setTypedNumber(prev => prev + num);
  };
  
  const handleBackspace = () => {
    setTypedNumber(prev => prev.slice(0, -1));
  };
  
  const handleClaimNumber = () => {
    if (!typedNumber) {
      alert('Please enter a number using the dialpad');
      return;
    }
    
    if (availability !== true) {
      alert('Please wait for availability check or choose an available number');
      return;
    }
    
    // Navigate to claim page
    router.push(`/${typedNumber}`);
  };
  
  const getStatusIndicator = () => {
    if (!typedNumber) return null;
    if (isChecking) return 'checking';
    if (availability === true) return 'available';
    if (availability === false) return 'unavailable';
    return null;
  };
  
  return (
    <>
      <Head>
        <title>313-Connect - Your Local Network, Rooted in Detroit</title>
        <meta name="description" content="Your local network — verified by connection, rooted in Detroit." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container>
        <Header>
          <Logo>313 CONNECT</Logo>
        </Header>
        
        <Hero>
          <HeroContent>
            
            <NumberDisplay>
              <DisplayLabel>Claim Your Number</DisplayLabel>
              <NumberRow>
                <DisplayedNumber>
                  {typedNumber ? `313-${typedNumber}` : '313-___'}
                </DisplayedNumber>
                <StatusIndicator $status={getStatusIndicator()}>
                  {getStatusIndicator() === 'checking' && '⟳'}
                  {getStatusIndicator() === 'available' && '✓'}
                  {getStatusIndicator() === 'unavailable' && '✕'}
                </StatusIndicator>
              </NumberRow>
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
                  <ButtonNumber>{num}</ButtonNumber>
                  {KEYPAD_LETTERS[num] && (
                    <ButtonLetters>{KEYPAD_LETTERS[num]}</ButtonLetters>
                  )}
                </DialButton>
              ))}
              
              {/* Empty space */}
              <div />
              
              {/* Zero button */}
              <DialButton
                className="zero-button"
                $isActive={activeNumber === 0}
                onMouseEnter={() => setActiveNumber(0)}
                onMouseLeave={() => setActiveNumber(null)}
                onClick={() => handleNumberClick(0)}
              >
                <ButtonNumber>0</ButtonNumber>
                <ButtonLetters style={{ opacity: 0.4 }}>+</ButtonLetters>
              </DialButton>
              
              {/* Backspace button */}
              <DialButton
                className="backspace-button"
                onClick={handleBackspace}
                disabled={!typedNumber}
              >
                <ButtonNumber style={{ fontSize: 'clamp(1.4rem, 4vw, 1.6rem)' }}>⌫</ButtonNumber>
              </DialButton>
            </DialPad>
            
            <ClaimButton 
              onClick={handleClaimNumber}
              $show={availability === true}
            >
              CLAIM THIS NUMBER
            </ClaimButton>
          </HeroContent>
        </Hero>
        
        {/* How It Works Section */}
        <Section id="how-it-works">
          <SectionTitle>How It Works</SectionTitle>
          <SectionSubtitle>
            Three simple steps to join Detroit&apos;s hyperlocal network
          </SectionSubtitle>
          
          <StepsContainer>
            <StepCard>
              <StepNumber>1</StepNumber>
              <StepTitle>Pick Your Number</StepTitle>
              <StepDescription>
                Choose a unique number in the 313 area code. It&apos;s your identity on the network.
              </StepDescription>
            </StepCard>
            
            <StepCard>
              <StepNumber>2</StepNumber>
              <StepTitle>Download the App</StepTitle>
              <StepDescription>
                Get the 313 Connect mobile app and complete your verification with a wallet signature.
              </StepDescription>
            </StepCard>
            
            <StepCard>
              <StepNumber>3</StepNumber>
              <StepTitle>Join the Network</StepTitle>
              <StepDescription>
                Connect with locals, attend events, and build your community — all verified by real connections.
              </StepDescription>
            </StepCard>
          </StepsContainer>
        </Section>
        
        {/* Features Section */}
        <Section id="features" style={{ background: 'rgba(255, 115, 0, 0.02)' }}>
          <SectionTitle>Features</SectionTitle>
          <SectionSubtitle>
            Everything you need for a trusted, local network
          </SectionSubtitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>📱</FeatureIcon>
              <FeatureTitle>Your Number, Your Identity</FeatureTitle>
              <FeatureDescription>
                Claim a unique 313 number that represents you. Simple, memorable, and uniquely yours.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🔒</FeatureIcon>
              <FeatureTitle>Privacy First</FeatureTitle>
              <FeatureDescription>
                Your data stays yours. Web3 wallet authentication ensures secure, private connections.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🤝</FeatureIcon>
              <FeatureTitle>Real Connections</FeatureTitle>
              <FeatureDescription>
                Build your network through verified, in-person interactions. No fake profiles, just real people.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📍</FeatureIcon>
              <FeatureTitle>Hyperlocal Events</FeatureTitle>
              <FeatureDescription>
                Discover and create events in your neighborhood. Check in with your 313 identity.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🎯</FeatureIcon>
              <FeatureTitle>Detroit-Rooted</FeatureTitle>
              <FeatureDescription>
                Built for the 313 community. A network that celebrates Detroit&apos;s unique culture and spirit.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>Edge-Fast Database</FeatureTitle>
              <FeatureDescription>
                Powered by Turso&apos;s distributed SQLite. Lightning-fast queries from anywhere in the world.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
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
