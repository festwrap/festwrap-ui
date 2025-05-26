import { render, screen } from '@testing-library/react';
import PlaylistGeneratedSuccessfully from '@/pages/generate/success/[playlistId]';
import { useRouter } from 'next/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    },
  };
});

vi.mock('next/router', () => {
  return {
    __esModule: true,
    useRouter: vi.fn(),
  };
});

describe('PlaylistGeneratedSuccessfully Page', () => {
  beforeEach(() => {
    vi.mocked(useRouter as any).mockReturnValue({
      query: { playlistId: 'test-playlist-id', partialError: undefined },
    });
  });

  it('renders correctly when playlistId is provided and partialError is not present', () => {
    render(<PlaylistGeneratedSuccessfully />);

    expect(document.title).toBe('meta.title');

    const spotifyIframe = screen.getByTitle('Spotify embedded playlist');
    expect(spotifyIframe).toBeInTheDocument();
    expect(spotifyIframe).toHaveAttribute(
      'src',
      'https://open.spotify.com/embed/playlist/test-playlist-id'
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders correctly when playlistId and partialError are provided', () => {
    vi.mocked(useRouter as any).mockReturnValue({
      query: { playlistId: 'test-playlist-id-2', partialError: 'true' },
    });

    render(<PlaylistGeneratedSuccessfully />);

    expect(document.title).toBe('meta.title');

    const spotifyIframe = screen.getByTitle('Spotify embedded playlist');
    expect(spotifyIframe).toBeInTheDocument();
    expect(spotifyIframe).toHaveAttribute(
      'src',
      'https://open.spotify.com/embed/playlist/test-playlist-id-2'
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('errors.submitPlaylist.missingArtists')
    ).toBeInTheDocument();
  });

  it('renders without playlistId (should ideally not happen but test robustness)', () => {
    vi.mocked(useRouter as any).mockReturnValue({
      query: { partialError: undefined }, // No playlistId
    });

    render(<PlaylistGeneratedSuccessfully />);

    expect(document.title).toBe('meta.title');

    const spotifyIframe = screen.queryByTitle('Spotify embedded playlist');
    expect(spotifyIframe).not.toBeInTheDocument();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
