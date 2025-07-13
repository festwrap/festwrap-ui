import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Footer from './Footer';
import setLanguage from 'next-translate/setLanguage';

vi.mock('next-translate/setLanguage', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('Footer', () => {
  test('should change the language when clicking on the language button', async () => {
    render(<Footer />);

    const languageButton = screen.getByRole('combobox');
    languageButton.click();

    const spanishOptionItem = await screen.findByText('languages.spanish');
    fireEvent.click(spanishOptionItem);

    expect(setLanguage).toHaveBeenCalledWith('es');
  });
});
