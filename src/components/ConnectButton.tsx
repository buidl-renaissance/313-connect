import styled from 'styled-components';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { QRModal } from './QRModal';

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, #ff7300 0%, #ffa500 100%)'};
  color: #ffffff;
  border: ${props => props.$variant === 'secondary' ? '2px solid rgba(255, 255, 255, 0.3)' : 'none'};
  padding: 1rem 2rem;
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
    box-shadow: ${props => props.$variant === 'secondary'
      ? 'none'
      : '0 10px 30px rgba(255, 115, 0, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Identity = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #ff7300;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

interface ConnectButtonProps {
  variant?: 'primary' | 'secondary';
}

export function ConnectButton({ variant = 'primary' }: ConnectButtonProps) {
  const { isAuthenticated, user, requestChallenge, challenge, verifySignature, logout } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    await requestChallenge();
    setIsLoading(false);
    setShowQR(true);
  };

  const handleVerify = async (signature: string, walletAddress: string) => {
    const result = await verifySignature(signature, walletAddress);
    if (result) {
      setShowQR(false);
    }
    return result;
  };

  if (isAuthenticated && user) {
    return (
      <UserInfo>
        {user.identity && (
          <Identity>313{user.identity.number}</Identity>
        )}
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </UserInfo>
    );
  }

  return (
    <>
      <Button 
        $variant={variant}
        onClick={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      {showQR && challenge && (
        <QRModal
          challenge={challenge}
          onVerify={handleVerify}
          onClose={() => setShowQR(false)}
        />
      )}
    </>
  );
}

