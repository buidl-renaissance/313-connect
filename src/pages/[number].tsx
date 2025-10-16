import Head from "next/head";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  
  @media (max-width: 480px) {
    min-height: 100vh;
    padding: 0.5rem;
  }
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 115, 0, 0.2);
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -1px;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Content = styled.div`
  max-width: 500px;
  width: calc(100% - 2rem);
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  font-family: 'Courier New', Courier, monospace;
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    border-radius: 16px;
    max-width: 100%;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #ff7300;
  margin: 0 0 0.5rem;
  font-weight: 700;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const NumberDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #ff7300;
  font-family: monospace;
  letter-spacing: 4px;
  margin: 0.75rem 0;
  
  @media (max-width: 480px) {
    font-size: 2rem;
    letter-spacing: 3px;
  }
`;

const Text = styled.p`
  color: #cccccc;
  margin: 0.5rem 0;
  line-height: 1.6;
  text-align: center;
  font-size: 1rem;
`;

const QRContainer = styled.div`
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 12px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin: 0.75rem 0;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  color: #999999;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ff7300;
  }
  
  @media (max-width: 480px) {
    margin-top: 1rem;
    font-size: 0.85rem;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 68, 68, 0.1);
  border: 2px solid rgba(255, 68, 68, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  
  h3 {
    color: #ff4444;
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
  }
  
  p {
    color: #cccccc;
    margin: 0;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem 1rem;
    
    h3 {
      font-size: 1.1rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 115, 0, 0.2);
  border-top-color: #ff7300;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function ClaimNumber() {
  const router = useRouter();
  const { number } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!number) return;

    const checkAvailability = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/identities/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ number: number as string }),
        });

        const data = await response.json();
        setIsAvailable(data.available);
      } catch (err) {
        console.error('Error checking availability:', err);
        setError('Failed to check number availability');
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [number]);

  return (
    <>
      <Head>
        <title>Claim 313-{number} - 313 Connect</title>
        <meta name="description" content={`Claim your 313-${number} identity on 313 Connect`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container>
        <Header>
          <Logo>313 CONNECT</Logo>
        </Header>

        <Content>
          {isLoading ? (
            <>
              <Title>Checking Availability</Title>
              <Spinner />
            </>
          ) : error ? (
            <>
              <Title>Error</Title>
              <ErrorMessage>
                <h3>⚠️ Something went wrong</h3>
                <p>{error}</p>
              </ErrorMessage>
              <BackLink href="/">← Claim another number</BackLink>
            </>
          ) : !isAvailable ? (
            <>
              <Title>Number Taken</Title>
              <NumberDisplay>313-{number}</NumberDisplay>
              <ErrorMessage>
                <h3>❌ This number is already claimed</h3>
                <p>Try choosing a different number.</p>
              </ErrorMessage>
              <BackLink href="/">← Claim another number</BackLink>
            </>
          ) : (
            <>
              <Title>Claim Your Number</Title>
              <NumberDisplay>313-{number}</NumberDisplay>
              <Text style={{ fontSize: '0.9rem', color: '#999999', marginBottom: '0.5rem' }}>
                Scan the QR code with your phone
              </Text>

              <QRContainer>
                <QRCodeSVG
                  value={`https://313.builddetroit.com/app?claim=${number}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </QRContainer>

              <div style={{ marginTop: '0.75rem', padding: '0.875rem', background: 'rgba(255, 170, 0, 0.1)', borderRadius: '10px', width: '100%', maxWidth: '300px' }}>
                <Text style={{ fontSize: '0.9rem', color: '#ffaa00', marginBottom: '0.35rem' }}>
                  🚧 Coming Soon
                </Text>
                <Text style={{ fontSize: '0.8rem', color: '#999999' }}>
                  The mobile app is currently in development
                </Text>
              </div>

              <BackLink href="/">← Claim another number</BackLink>
            </>
          )}
        </Content>
      </Container>
    </>
  );
}

