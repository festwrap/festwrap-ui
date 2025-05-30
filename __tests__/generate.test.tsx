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
  playlists: {
    existing: {
      id: 'existing-playlist-1',
      name: 'My Existing Playlist',
      isPublic: true,
    },
    new: {
      name: 'Fest Bops',
    },
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
      playlists: [TEST_DATA.playlists.existing],
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

  async selectRadio(name: RegExp | string) {
    const radio = screen.getByRole('radio', { name });
    if (!radio.hasAttribute('data-state="checked"')) {
      await user.click(radio);
    }
  },

  async completeFirstSectionNewPlaylist(playlistName = 'My new playlist') {
    await actions.selectRadio(/playlistSetup.form.createNewPlaylist.title/i);
    await actions.type(
      /playlistSetup.form.createNewPlaylist.giveAName/i,
      playlistName
    );
  },

  async completeFirstSectionExistingPlaylist(
    playlistName = TEST_DATA.playlists.existing.name
  ) {
    await actions.selectRadio(/playlistSetup.form.useExistingPlaylist.title/i);
    await actions.selectPlaylistAndAssetSelected(playlistName);
  },

  async completeSecondSection(artistNames = [TEST_DATA.artists.single.name]) {
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

  async selectPlaylistAndAssetSelected(playlistName: string) {
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const searchInput = screen.getByPlaceholderText(
      /playlistSetup.form.useExistingPlaylist.playlistSelector.placeholder/i
    );
    await user.type(searchInput, playlistName);

    await waitFor(async () => {
      const option = screen.getByRole('option', { name: playlistName });
      await user.click(option);
      expect(screen.getByText(playlistName)).toBeInTheDocument();
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

  it.each([
    {
      scenario: 'existing playlist update',
      getUpdatePlaylistFn: () => mockServices.playlistsService.updatePlaylist,
      firstSectionFn: actions.completeFirstSectionExistingPlaylist,
    },
    {
      scenario: 'new playlist creation',
      getUpdatePlaylistFn: () =>
        mockServices.playlistsService.createNewPlaylist,
      firstSectionFn: actions.completeFirstSectionNewPlaylist,
    },
  ])(
    'should display error toast when $scenario API fails',
    async ({ getUpdatePlaylistFn, firstSectionFn }) => {
      vi.mocked(getUpdatePlaylistFn()).mockRejectedValue(
        new Error('API Error')
      );
      renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

      await firstSectionFn();
      await actions.selectArtistAndAssertSelected(
        TEST_DATA.artists.single.name
      );
      await actions.click(/navigation.generate/i);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'errors.submitPlaylist.unexpectedError'
        );
      });
    }
  );

  describe('New Playlist Flow', () => {
    it('should successfully generate a new playlist from start to finish', async () => {
      renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

      const { name } = TEST_DATA.playlists.new;
      const artistsToSelect = [TEST_DATA.artists.single.name];

      await actions.completeFirstSectionNewPlaylist(name);
      await actions.completeSecondSection(artistsToSelect);

      expect(mockPush).toHaveBeenCalledWith(
        '/generate/success/' + TEST_DATA.createdPlaylistId
      );

      expect(
        mockServices.playlistsService.createNewPlaylist
      ).toHaveBeenCalledWith({
        playlist: {
          name,
          isPublic: false,
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
      await actions.completeFirstSectionNewPlaylist();

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

      await actions.completeFirstSectionNewPlaylist();

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

      await actions.selectRadio(/form.createNewPlaylist.title/i);
      await actions.click(/navigation.generate/i);

      expect(
        await screen.findByText(/errors.name.required/i)
      ).toBeInTheDocument();
    });
  });

  describe('Existing Playlist Flow', () => {
    it('should successfully update an existing playlist', async () => {
      renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

      await actions.completeFirstSectionExistingPlaylist();
      await actions.completeSecondSection([TEST_DATA.artists.single.name]);

      expect(mockPush).toHaveBeenCalledWith(
        '/generate/success/' + TEST_DATA.playlists.existing.id
      );
    });

    it('should validate playlist selection is required', async () => {
      renderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

      await actions.selectRadio(/form.useExistingPlaylist.title/i);
      await actions.click(/navigation.generate/i);

      expect(
        await screen.findByText(/errors.playlistSelected.required/i)
      ).toBeInTheDocument();
    });
  });
});
