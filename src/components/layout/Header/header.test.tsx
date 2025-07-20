import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/header/header';
import { vi, describe, beforeAll, test, expect } from 'vitest';

vi.mock('next-auth/react', () => {
  return {
    __esModule: true,
    useSession: vi.fn(),
  };
});

vi.mock('@components/ui/DropdownMenu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

describe('Header', () => {
  beforeAll(() => {
    window.PointerEvent = MouseEvent as typeof PointerEvent;
  });

  test('should render header', () => {
    vi.mocked(useSession).mockReturnValue({
      update: vi.fn(),
      data: null,
      status: 'unauthenticated',
    });

    render(<Header />);

    // check navlinks
    expect(
      screen.getByRole('link', { name: /nav.getStarted/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /nav.aboutUs/i })
    ).toBeInTheDocument();
  });
});
