import styled from 'styled-components';
import { useRouter } from 'next/router';

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 115, 0, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 115, 0, 0.1);
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #aaaaaa;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
`;

const Location = styled.div`
  color: #ff7300;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DateTime = styled.div`
  color: #cccccc;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const Region = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 115, 0, 0.2);
  color: #ff7300;
  margin-top: 0.5rem;
`;

const Creator = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: #888888;
`;

interface EventCardProps {
  id: string;
  title: string;
  description?: string | null;
  location: string;
  region?: string | null;
  startTime: Date;
  endTime?: Date | null;
  creator?: {
    identity?: {
      fullNumber: string;
    };
    profile?: {
      displayName: string | null;
    };
  };
}

export function EventCard({
  id,
  title,
  description,
  location,
  region,
  startTime,
  endTime,
  creator,
}: EventCardProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleClick = () => {
    router.push(`/events/${id}`);
  };

  return (
    <Card onClick={handleClick}>
      <Title>{title}</Title>
      
      {description && (
        <Description>
          {description.length > 150
            ? `${description.substring(0, 150)}...`
            : description}
        </Description>
      )}
      
      <Location>
        📍 {location}
      </Location>
      
      <DateTime>
        🕐 {formatDate(startTime)} at {formatTime(startTime)}
        {endTime && ` - ${formatTime(endTime)}`}
      </DateTime>
      
      {region && <Region>{region}</Region>}
      
      {creator && (
        <Creator>
          Created by{' '}
          {creator.profile?.displayName ||
            creator.identity?.fullNumber ||
            'Anonymous'}
        </Creator>
      )}
    </Card>
  );
}

