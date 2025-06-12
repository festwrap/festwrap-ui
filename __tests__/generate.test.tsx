import { describe, expect, vi, it, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GeneratePlaylistPage, { GenerateProps } from '@/pages/generate';
import { ReactNode } from 'react';
import { ServiceProvider } from '@/contexts/ServiceContext';
import { toast } from 'sonner';
import { IPlaylistsService } from '@/services/playlistsService';
import { IArtistsService } from '@/services/artistsService';
import { CreatedPlaylistStatus } from '@/entities/playlists';
import { useRouter } from 'next/router';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

const staticTranslations: GenerateProps = {
  translations: {
    meta: {
      title: 'Generate a playlist',
      description: 'Generate a playlist description',
      keywords: 'Generate a playlist keywords',
    },
  },
};

const TEST_DATA = {
  playlist: {
    name: 'Fest Bops',
  },
  artists: {
    single: { name: 'Holding Absence', imageUri: undefined },
    multiple: [
      { name: 'Holding Absence', imageUri: undefined },
      { name: 'Loathe', imageUri: undefined },
    ],
  },
  createdPlaylistId: '123',
};

type ServiceMocks = {
  playlistsService: IPlaylistsService;
  artistsService: IArtistsService;
};

const createServiceMocks = (): ServiceMocks => ({
  playlistsService: {
    searchPlaylists: vi.fn().mockResolvedValue({
      playlists: [TEST_DATA.playlist.name],
    }),
    createNewPlaylist: vi.fn().mockResolvedValue({
      playlistCreated: {
        id: TEST_DATA.createdPlaylistId,
        status: CreatedPlaylistStatus.OK,
      },
    }),
    updatePlaylist: vi.fn().mockResolvedValue({
      playlistUpdated: { status: CreatedPlaylistStatus.OK },
    }),
  },
  artistsService: {
    searchArtists: vi.fn().mockResolvedValue({
      artists: [TEST_DATA.artists.single],
    }),
  },
});

let mockServices: ServiceMocks;
let user: ReturnType<typeof userEvent.setup>;

const renderWithProviders = (
  ui: ReactNode,
  services: ServiceMocks = mockServices
) => {
  return render(<ServiceProvider value={services}>{ui}</ServiceProvider>);
};

const actions = {
  async click(selector: RegExp | string) {
    const element = screen.getByRole('button', { name: selector });
    await user.click(element);
  },

  async type(labelText: RegExp | string, value: string) {
    const input = screen.getByLabelText(labelText);
    await user.clear(input);
    await user.type(input, value);
  },

  async fillPlaylistName(playlistName = 'My new playlist') {
    await actions.type(
      /playlistSetup.form.createNewPlaylist.giveAName/i,
      playlistName
    );
  },

  async selectArtists(artistNames = [TEST_DATA.artists.single.name]) {
    for (const name of artistNames) {
      await actions.selectArtistAndAssertSelected(name);
    }
    await actions.click(/navigation.generate/i);
  },

  async selectArtistAndAssertSelected(artistName: string) {
    const searchInput = screen.getByPlaceholderText(
      'playlistSearchArtists.searchPlaceholder'
    );
    await user.clear(searchInput);
    await user.type(searchInput, artistName);

    await waitFor(async () => {
      const option = screen.getByRole('option', { name: artistName });
      await user.click(option);
      expect(screen.getByText(artistName)).toBeInTheDocument();
    });
  },
};

describe('GeneratePlaylistPage', () => {
  const mockPush = vi.fn();

  beforeAll(() => {
    user = userEvent.setup({ delay: null });
  });

  beforeEach(() => {
    mockServices = createServiceMocks();
    vi.mocked(useRouter as any).mockReturnValue({
      push: mockPush,
    });
  });

  it('should display beta info alert', () => {
    renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);
    expect(screen.getByText('betaInfo.title')).toBeInTheDocument();
  });

  it('should display error toast when $scenario API fails', async () => {
    vi.mocked(mockServices.playlistsService.createNewPlaylist).mockRejectedValue(
      new Error('API Error')
    );
    renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    await actions.fillPlaylistName();
    await actions.selectArtistAndAssertSelected(
      TEST_DATA.artists.single.name
    );
    await actions.click(/navigation.generate/i);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'errors.submitPlaylist.unexpectedError'
      );
    });
  });

  it('should successfully generate a new playlist from start to finish', async () => {
    renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const name = TEST_DATA.playlist.name;
    const artistsToSelect = [TEST_DATA.artists.single.name];

    await actions.fillPlaylistName(name);
    await actions.selectArtists(artistsToSelect);

    expect(mockPush).toHaveBeenCalledWith(
      '/generate/success/' + TEST_DATA.createdPlaylistId
    );

    expect(
      mockServices.playlistsService.createNewPlaylist
    ).toHaveBeenCalledWith({
      playlist: {
        name,
        isPublic: true,
      },
      artists: artistsToSelect.map((name) => ({ name })),
    });
  });

  it('should handle multiple artist selection and removal', async () => {
    vi.mocked(mockServices.artistsService.searchArtists).mockResolvedValue({
      artists: TEST_DATA.artists.multiple,
      message: 'Success',
    });

    renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);
    await actions.fillPlaylistName();

    const [artist1, artist2] = TEST_DATA.artists.multiple.map((a) => a.name);
    await actions.selectArtistAndAssertSelected(artist1);
    await actions.selectArtistAndAssertSelected(artist2);

    expect(screen.getByText(artist1)).toBeInTheDocument();
    expect(screen.getByText(artist2)).toBeInTheDocument();

    const removeButton = screen.getByLabelText(
      `playlistSearchArtists.removeArtist ${artist1}`
    );
    await user.click(removeButton);
    expect(screen.queryByText(artist1)).not.toBeInTheDocument();
    expect(screen.getByText(artist2)).toBeInTheDocument();
  });

  it('should show an error if more than maximum artists selected', async () => {
    const nArtists = 6;
    const mockedArtists = [
      ...Array(nArtists)
        .fill(null)
        .map((_, i) => ({
          name: 'New Artist ' + i,
          imageUri: undefined,
        })),
    ];

    vi.mocked(mockServices.artistsService.searchArtists).mockResolvedValue({
      artists: mockedArtists,
      message: 'Success',
    });

    renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    await actions.fillPlaylistName();

    for (const artist of mockedArtists) {
      await actions.selectArtistAndAssertSelected(artist.name);
    }

    expect(
      await screen.findByText(/errors.selectedArtists.max/i)
    ).toBeInTheDocument();

    expect(
      mockServices.playlistsService.createNewPlaylist
    ).not.toHaveBeenCalled();
  });

  it('should validate playlist name is required', async () => {
    renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    await actions.click(/navigation.generate/i);

    expect(
      await screen.findByText(/errors.name.required/i)
    ).toBeInTheDocument();
  });
});
