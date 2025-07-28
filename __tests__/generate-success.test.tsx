import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

    expect(
      screen.queryByText('errors.submitPlaylist.missingArtists')
    ).not.toBeInTheDocument();
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

    expect(
      screen.getByText('errors.submitPlaylist.missingArtists')
    ).toBeInTheDocument();
  });

  it('should display beta info alert', () => {
    render(<PlaylistGeneratedSuccessfully />);
    expect(screen.getByText('betaInfo.title')).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    render(<PlaylistGeneratedSuccessfully />);

    expect(
      screen.getByText('playlistSuccess.loadingPlaylist')
    ).toBeInTheDocument();
  });

  it('renders iframe with correct attributes and handles basic interactions', async () => {
    render(<PlaylistGeneratedSuccessfully />);

    const iframe = screen.getByTitle('Spotify embedded playlist');

    expect(iframe).toHaveAttribute(
      'src',
      'https://open.spotify.com/embed/playlist/test-playlist-id'
    );
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('height', '500');
    expect(iframe).toHaveAttribute('loading', 'lazy');
    expect(iframe).toHaveAttribute(
      'allow',
      'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
    );
  });

  it('shows open in Spotify button when iframe loads successfully', async () => {
    render(<PlaylistGeneratedSuccessfully />);

    const iframe = screen.getByTitle('Spotify embedded playlist');

    fireEvent.load(iframe);

    await waitFor(() => {
      expect(
        screen.getByText('playlistSuccess.openInSpotify')
      ).toBeInTheDocument();
    });
  });
});
