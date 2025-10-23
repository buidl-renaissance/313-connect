import Head from 'next/head';
import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/router';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  
  @media print {
    background: white;
    min-height: auto;
  }
`;

const Card = styled.div`
  max-width: 600px;
  width: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 2px solid rgba(255, 115, 0, 0.3);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  
  @media print {
    background: white;
    border: 2px solid #ff7300;
    box-shadow: none;
    max-width: 100%;
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Logo = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  letter-spacing: -2px;
  
  @media print {
    color: #ff7300;
    -webkit-text-fill-color: #ff7300;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  color: #cccccc;
  margin: 0 0 2rem 0;
  font-weight: 600;
  
  @media print {
    color: #333;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const QRContainer = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  display: inline-block;
  margin: 2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media print {
    box-shadow: none;
  }
`;

const URL = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff7300;
  margin: 2rem 0 1rem;
  font-family: monospace;
  
  @media print {
    color: #ff7300;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    word-break: break-all;
  }
`;

const Instructions = styled.p`
  font-size: 1.1rem;
  color: #aaaaaa;
  line-height: 1.6;
  margin: 1rem 0;
  
  @media print {
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media print {
    display: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
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
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const BackLink = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
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
  
  @media print {
    display: none;
  }
  
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    left: auto;
    margin-bottom: 1rem;
  }
`;

const PrintNote = styled.div`
  display: none;
  
  @media print {
    display: block;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #ddd;
    color: #666;
    font-size: 0.9rem;
  }
`;

export default function QRPage() {
  const router = useRouter();
  const siteUrl = 'https://313connect.org';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = '313connect-qr-code.png';
      link.href = url;
      link.click();
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    alert('URL copied to clipboard!');
  };

  return (
    <>
      <Head>
        <title>QR Code - 313Connect</title>
        <meta name="description" content="Scan to join 313Connect" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container>
        <BackLink onClick={() => router.push('/')}>
          ← Back to Home
        </BackLink>

        <Card>
          <Logo>313 CONNECT</Logo>
          <Tagline>I Got a Guy for That</Tagline>

          <Instructions>
            Scan this QR code to visit 313Connect and claim your number
          </Instructions>

          <QRContainer>
            <QRCodeSVG
              value={siteUrl}
              size={300}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </QRContainer>

          <URL>{siteUrl}</URL>

          <Instructions>
            Your local network for connections, services, and opportunities
          </Instructions>

          <ButtonGroup>
            <Button onClick={handlePrint}>
              🖨️ Print QR Code
            </Button>
            <SecondaryButton onClick={handleDownload}>
              💾 Download PNG
            </SecondaryButton>
            <SecondaryButton onClick={handleCopyUrl}>
              📋 Copy URL
            </SecondaryButton>
          </ButtonGroup>

          <PrintNote>
            Scan this QR code with your phone camera to join 313Connect
            <br />
            Or visit: {siteUrl}
          </PrintNote>
        </Card>
      </Container>
    </>
  );
}

