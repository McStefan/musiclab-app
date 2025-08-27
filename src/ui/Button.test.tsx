import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';
import { ThemeProvider } from '../theme/ThemeProvider';

// Mock theme for testing
const mockTheme = {
  colors: {
    primary: '#1DB954',
    white: '#FFFFFF',
    text: '#FFFFFF',
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
};

const ButtonWithTheme = ({ children, ...props }: any) => (
  <ThemeProvider>
    <Button {...props}>{children}</Button>
  </ThemeProvider>
);

describe('Button Component', () => {
  it('renders with title', () => {
    render(<ButtonWithTheme title="Test Button" />);
    
    expect(screen.getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = vi.fn();
    render(<ButtonWithTheme title="Press Me" onPress={onPressMock} />);
    
    const button = screen.getByText('Press Me');
    fireEvent.press(button);
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<ButtonWithTheme title="Loading" loading={true} />);
    
    // Should show loading indicator instead of text
    expect(screen.queryByText('Loading')).toBeFalsy();
    // Note: In a real test, we'd check for the loading indicator
  });

  it('is disabled when loading', () => {
    const onPressMock = vi.fn();
    render(
      <ButtonWithTheme 
        title="Disabled" 
        loading={true} 
        onPress={onPressMock} 
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.press(button);
    
    // Should not call onPress when loading
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    render(
      <ButtonWithTheme 
        title="Custom Style" 
        style={customStyle} 
      />
    );
    
    const button = screen.getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('supports different variants', () => {
    const { rerender } = render(
      <ButtonWithTheme title="Primary" variant="primary" />
    );
    
    let button = screen.getByRole('button');
    expect(button).toBeTruthy();
    
    rerender(<ButtonWithTheme title="Secondary" variant="secondary" />);
    button = screen.getByRole('button');
    expect(button).toBeTruthy();
    
    rerender(<ButtonWithTheme title="Outline" variant="outline" />);
    button = screen.getByRole('button');
    expect(button).toBeTruthy();
  });

  it('handles disabled state', () => {
    const onPressMock = vi.fn();
    render(
      <ButtonWithTheme 
        title="Disabled" 
        disabled={true} 
        onPress={onPressMock} 
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.press(button);
    
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
