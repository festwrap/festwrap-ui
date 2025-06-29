import { describe, expect, vi, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchArtistsCombobox } from './SearchArtistsCombobox';
import userEvent from '@testing-library/user-event';

describe('SearchArtistsCombobox', () => {
  async function selectArtistInputAndType(
    artistName: string | undefined = undefined
  ) {
    const artistInput = screen.getByRole('textbox');
    await userEvent.click(artistInput);
    if (artistName !== undefined) {
      await userEvent.type(artistInput, artistName);
    }
  }

  it('shows searching message while searching', async () => {
    render(
      <SearchArtistsCombobox
        options={[]}
        values={[]}
        onChange={vi.fn()}
        onSearch={vi.fn()}
        isSearching
        hasError={false}
      />
    );
    await selectArtistInputAndType('Descendents');

    const searchItem = screen
      .getAllByRole('status')
      .find(
        (item) =>
          item.textContent == 'playlistSearchArtists.artistSearch.searching'
      );
    expect(searchItem).toBeInTheDocument();
  });

  it('shows empty search message in the placeholder when search is empty', async () => {
    render(
      <SearchArtistsCombobox
        options={[]}
        values={[]}
        onChange={vi.fn()}
        onSearch={vi.fn()}
        isSearching={false}
        hasError={false}
        placeholder="Type to start searching"
      />
    );
    await selectArtistInputAndType();

    const placeholder = screen.getByPlaceholderText('Type to start searching');
    expect(placeholder).toBeInTheDocument();
  });

  it('shows error on search artists error', async () => {
    render(
      <SearchArtistsCombobox
        options={[]}
        values={[]}
        onChange={vi.fn()}
        onSearch={vi.fn()}
        isSearching={false}
        hasError={true}
      />
    );
    await selectArtistInputAndType('Toe');

    const errorItem = screen
      .getAllByRole('alert')
      .find(
        (item) => item.textContent == 'errors.artistSearch.unexpectedError'
      );
    expect(errorItem).toBeInTheDocument();
  });

  it('shows empty results on no artists', async () => {
    render(
      <SearchArtistsCombobox
        options={[]}
        values={[]}
        onChange={vi.fn()}
        onSearch={vi.fn()}
        isSearching={false}
        hasError={false}
      />
    );
    await selectArtistInputAndType('Thursday');

    const noResultsItem = screen
      .getAllByRole('status')
      .find(
        (item) =>
          item.textContent == 'playlistSearchArtists.artistSearch.noResults'
      );
    expect(noResultsItem).toBeInTheDocument();
  });
});
