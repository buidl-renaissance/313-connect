import styled from 'styled-components';

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 115, 0, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 115, 0, 0.1);
  }
`;

const Identity = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #ff7300;
  margin-bottom: 0.5rem;
  font-family: monospace;
`;

const DisplayName = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Region = styled.div`
  font-size: 1rem;
  color: #aaaaaa;
  margin-bottom: 1rem;
`;

const Bio = styled.p`
  color: #cccccc;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const Badge = styled.span<{ $verified?: boolean }>`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.$verified 
    ? 'rgba(0, 255, 136, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$verified ? '#00ff88' : '#ffffff'};
  margin-top: 1rem;
`;

interface ProfileCardProps {
  identity?: {
    number: string;
  };
  displayName?: string | null;
  bio?: string | null;
  region?: string | null;
  verificationStatus?: string;
}

export function ProfileCard({
  identity,
  displayName,
  bio,
  region,
  verificationStatus = 'unverified',
}: ProfileCardProps) {
  return (
    <Card>
      {identity && (
        <Identity>313{identity.number}</Identity>
      )}
      
      {displayName && (
        <DisplayName>{displayName}</DisplayName>
      )}
      
      {region && (
        <Region>📍 {region}</Region>
      )}
      
      {bio && (
        <Bio>{bio}</Bio>
      )}
      
      <Badge $verified={verificationStatus === 'verified'}>
        {verificationStatus === 'verified' ? '✓ Verified' : 'Unverified'}
      </Badge>
    </Card>
  );
}

