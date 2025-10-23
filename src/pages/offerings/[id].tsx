import Head from 'next/head';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
`;

const Header = styled.header`
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 115, 0, 0.2);
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff7300 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  cursor: pointer;
`;

const Main = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ff7300;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 115, 0, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #cccccc;
  margin-bottom: 0.5rem;
`;

const Required = styled.span`
  color: #ff7300;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff7300;
  }
  
  &::placeholder {
    color: #666666;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff7300;
  }
  
  &::placeholder {
    color: #666666;
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff7300;
  }
  
  option {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

const HelpText = styled.div`
  font-size: 0.85rem;
  color: #888888;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  background: ${props => 
    props.$variant === 'secondary' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'linear-gradient(135deg, #ff7300 0%, #ffa500 100%)'
  };
  color: #ffffff;
  border: ${props => 
    props.$variant === 'secondary' 
      ? '1px solid rgba(255, 255, 255, 0.2)' 
      : 'none'
  };
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaaaaa;
  font-size: 1.1rem;
`;

const CATEGORIES = [
  'Art & Design',
  'Photography',
  'Music',
  'Tattoos',
  'Stickers & Prints',
  'Fashion',
  'Food & Beverage',
  'Technology',
  'Consulting',
  'Event Planning',
  'Other',
];

export default function EditOffering() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    contactEmail: '',
    contactPhone: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!token || !id) return;

    fetchOffering();
  }, [token, id]);

  const fetchOffering = async () => {
    try {
      const response = await fetch(`/api/offerings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setFormData({
          title: data.offering.title || '',
          description: data.offering.description || '',
          category: data.offering.category || '',
          price: data.offering.price || '',
          contactEmail: data.offering.contactEmail || '',
          contactPhone: data.offering.contactPhone || '',
          imageUrl: data.offering.imageUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching offering:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/offerings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/offerings');
      } else {
        alert(data.error || 'Failed to update offering');
      }
    } catch (error) {
      console.error('Error updating offering:', error);
      alert('Failed to update offering');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <Container>
          <LoadingState>Loading offering...</LoadingState>
        </Container>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Head>
        <title>Edit Offering - 313Connect</title>
        <meta name="description" content="Edit your offering" />
      </Head>

      <Container>
        <Header>
          <Logo onClick={() => router.push('/')}>313CONNECT</Logo>
        </Header>

        <Main>
          <Title>Edit Offering</Title>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                Title<Required>*</Required>
              </Label>
              <Input
                type="text"
                name="title"
                placeholder="e.g., Custom Sticker Design"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Category<Required>*</Required>
              </Label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                name="description"
                placeholder="Describe your offering..."
                value={formData.description}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Pricing</Label>
              <Input
                type="text"
                name="price"
                placeholder="e.g., $50/design or Free quote"
                value={formData.price}
                onChange={handleChange}
              />
              <HelpText>Enter your pricing or leave blank</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>Contact Email</Label>
              <Input
                type="email"
                name="contactEmail"
                placeholder="your@email.com"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Contact Phone</Label>
              <Input
                type="tel"
                name="contactPhone"
                placeholder="(313) 555-0123"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Image URL</Label>
              <Input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <HelpText>Optional: Add an image URL to showcase your offering</HelpText>
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                $variant="secondary"
                onClick={() => router.push('/offerings')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          </Form>
        </Main>
      </Container>
    </AuthGuard>
  );
}

