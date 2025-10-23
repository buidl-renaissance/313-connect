import styled from 'styled-components';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const Modal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid rgba(255, 115, 0, 0.3);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ff7300;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999999;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffffff;
  }
`;

const CardPreview = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 115, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ShareUrlDisplay = styled.div`
  background: rgba(255, 115, 0, 0.1);
  border: 1px solid rgba(255, 115, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 0;
  word-break: break-all;
  font-family: monospace;
  color: #ff7300;
  font-size: 0.9rem;
`;

const QRCodeContainer = styled.div`
  background: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  display: inline-block;
  margin: 1rem 0;
`;

const ShareButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ShareButton = styled.button<{ $icon?: string }>`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 115, 0, 0.2);
    border-color: rgba(255, 115, 0, 0.5);
  }
  
  &::before {
    content: '${props => props.$icon || ''}';
    font-size: 1.2rem;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 115, 0, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #00ff88;
  margin-bottom: 1rem;
  text-align: center;
`;

interface CardGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  offeringId?: string;
  offeringTitle?: string;
  token: string;
}

export function CardGenerator({ isOpen, onClose, offeringId, offeringTitle, token }: CardGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<{
    shareUrl: string;
    fullUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          offeringId: offeringId || null,
          title: offeringTitle || null,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedCard({
          shareUrl: data.card.shareUrl,
          fullUrl: data.shareUrl,
        });
      } else {
        alert(data.error || 'Failed to generate card');
      }
    } catch (error) {
      console.error('Error generating card:', error);
      alert('Failed to generate card');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCard) return;
    
    try {
      await navigator.clipboard.writeText(generatedCard.fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareTwitter = () => {
    if (!generatedCard) return;
    const text = offeringTitle ? `Check out my ${offeringTitle}!` : 'Connect with me!';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(generatedCard.fullUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareEmail = () => {
    if (!generatedCard) return;
    const subject = offeringTitle || 'Check this out';
    const body = `I'd like to share this with you: ${generatedCard.fullUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleClose = () => {
    setGeneratedCard(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal $isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Create Shareable Card</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        {!generatedCard ? (
          <CardPreview>
            <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
              {offeringTitle ? (
                <>Create a shareable card for <strong>{offeringTitle}</strong></>
              ) : (
                <>Create a shareable profile card</>
              )}
            </p>
            <PrimaryButton onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Card'}
            </PrimaryButton>
          </CardPreview>
        ) : (
          <>
            <SuccessMessage>
              ✓ Card created successfully!
            </SuccessMessage>

            <CardPreview>
              <p style={{ color: '#cccccc', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Share this link or QR code
              </p>

              <ShareUrlDisplay>{generatedCard.fullUrl}</ShareUrlDisplay>

              <QRCodeContainer>
                <QRCodeSVG
                  value={generatedCard.fullUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </QRCodeContainer>

              <ShareButtons>
                <ShareButton onClick={handleCopy} $icon={copied ? '✓' : '📋'}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </ShareButton>
                <ShareButton onClick={handleShareTwitter} $icon="🐦">
                  Twitter
                </ShareButton>
                <ShareButton onClick={handleShareEmail} $icon="✉️">
                  Email
                </ShareButton>
                <ShareButton 
                  onClick={() => {
                    const canvas = document.querySelector('canvas');
                    if (canvas) {
                      const url = canvas.toDataURL('image/png');
                      const link = document.createElement('a');
                      link.download = `313connect-${generatedCard.shareUrl}.png`;
                      link.href = url;
                      link.click();
                    }
                  }}
                  $icon="💾"
                >
                  Save QR
                </ShareButton>
              </ShareButtons>
            </CardPreview>

            <PrimaryButton onClick={handleClose}>
              Done
            </PrimaryButton>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

