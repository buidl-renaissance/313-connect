import styled from 'styled-components';
import { useState } from 'react';

const Card = styled.div<{ $inactive?: boolean }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 115, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  opacity: ${props => props.$inactive ? 0.6 : 1};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 115, 0, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 115, 0, 0.15);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImagePlaceholder = styled.div`
  color: #666;
  font-size: 3rem;
`;

const Category = styled.div`
  display: inline-block;
  background: rgba(255, 115, 0, 0.2);
  color: #ff7300;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #cccccc;
  line-height: 1.6;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ff7300;
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  font-size: 0.85rem;
  color: #999999;
  margin-bottom: 1rem;
  
  div {
    margin: 0.25rem 0;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => 
    props.$variant === 'danger' ? 'rgba(255, 68, 68, 0.2)' :
    props.$variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' :
    'linear-gradient(135deg, #ff7300 0%, #ffa500 100%)'
  };
  color: ${props => props.$variant === 'danger' ? '#ff4444' : '#ffffff'};
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$active ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 68, 68, 0.2)'};
  color: ${props => props.$active ? '#00ff88' : '#ff4444'};
  margin-left: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

interface OfferingCardProps {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  price?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onCreateCard?: (id: string) => void;
}

export function OfferingCard({
  id,
  title,
  description,
  category,
  price,
  contactEmail,
  contactPhone,
  imageUrl,
  isActive,
  showActions = false,
  onEdit,
  onDelete,
  onToggleActive,
  onCreateCard,
}: OfferingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this offering?')) return;
    
    setIsDeleting(true);
    if (onDelete) {
      await onDelete(id);
    }
    setIsDeleting(false);
  };

  return (
    <Card $inactive={!isActive}>
      <Header>
        <Category>{category}</Category>
        <StatusBadge $active={isActive}>
          {isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      </Header>

      {imageUrl ? (
        <ImageWrapper>
          <img src={imageUrl} alt={title} />
        </ImageWrapper>
      ) : (
        <ImageWrapper>
          <ImagePlaceholder>📦</ImagePlaceholder>
        </ImageWrapper>
      )}

      <Title>{title}</Title>
      
      {description && <Description>{description}</Description>}
      
      {price && <Price>{price}</Price>}

      {(contactEmail || contactPhone) && (
        <ContactInfo>
          {contactEmail && <div>📧 {contactEmail}</div>}
          {contactPhone && <div>📞 {contactPhone}</div>}
        </ContactInfo>
      )}

      {showActions && (
        <Actions>
          {onCreateCard && (
            <Button onClick={() => onCreateCard(id)}>
              Create Card
            </Button>
          )}
          {onEdit && (
            <Button $variant="secondary" onClick={() => onEdit(id)}>
              Edit
            </Button>
          )}
          {onToggleActive && (
            <Button 
              $variant="secondary" 
              onClick={() => onToggleActive(id, !isActive)}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </Button>
          )}
          {onDelete && (
            <Button 
              $variant="danger" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </Actions>
      )}
    </Card>
  );
}

