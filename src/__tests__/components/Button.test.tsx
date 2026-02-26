/**
 * Button component tests
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@components/common/Button';

describe('Button', () => {
  it('renders title', () => {
    const { getByText } = render(<Button title="Submit" onPress={() => {}} />);
    expect(getByText('Submit')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Tap" onPress={onPress} />);
    fireEvent.press(getByText('Tap'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Tap" onPress={onPress} disabled />);
    fireEvent.press(getByText('Tap'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
