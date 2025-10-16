import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 2px solid #ff7300;
  border-radius: 20px;
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 50px rgba(255, 115, 0, 0.3);
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #ff7300;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #aaaaaa;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const QRContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  display: inline-block;
  margin-bottom: 2rem;
`;

const Instructions = styled.div`
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  ol {
    text-align: left;
    margin: 1rem auto;
    max-width: 300px;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const ManualInput = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #ff7300;
  }
  
  &::placeholder {
    color: #666666;
  }
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #00ff88;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

interface QRModalProps {
  challenge: string;
  onVerify: (signature: string, walletAddress: string) => Promise<boolean>;
  onClose: () => void;
}

export function QRModal({ challenge, onVerify, onClose }: QRModalProps) {
  const [signature, setSignature] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // QR code contains challenge data that mobile app will read
  const qrData = JSON.stringify({
    challenge,
    type: '313connect-auth',
    timestamp: Date.now(),
  });

  const handleManualVerify = async () => {
    if (!signature || !walletAddress) {
      setError('Please enter both signature and wallet address');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = await onVerify(signature, walletAddress);
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('Verification failed. Please check your signature and try again.');
      }
    } catch {
      setError('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Scan to Authenticate</Title>
        <Description>
          Scan this QR code with your 313 Connect mobile app to sign in
        </Description>

        <QRContainer>
          <QRCodeSVG value={qrData} size={200} />
        </QRContainer>

        <Instructions>
          <strong>How to connect:</strong>
          <ol>
            <li>Open the 313 Connect mobile app</li>
            <li>Tap &quot;Scan to Connect&quot;</li>
            <li>Point your camera at this QR code</li>
            <li>Confirm the connection in the app</li>
          </ol>
        </Instructions>

        <ManualInput>
          <Description style={{ fontSize: '0.9rem' }}>
            Or enter your signature manually:
          </Description>
          <InputGroup>
            <Input
              type="text"
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
            <Button
              onClick={handleManualVerify}
              disabled={isVerifying || !signature || !walletAddress}
            >
              {isVerifying ? 'Verifying...' : 'Verify Signature'}
            </Button>
          </InputGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>✓ Successfully authenticated!</SuccessMessage>}
        </ManualInput>

        <CloseButton onClick={onClose}>Cancel</CloseButton>
      </Modal>
    </Overlay>
  );
}

