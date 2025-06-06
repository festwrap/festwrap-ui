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
        isSearching={true}
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

  it('shows empty search message when search is empty', async () => {
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
    await selectArtistInputAndType();

    const emptySearchItem = screen
      .getAllByRole('status')
      .find(
        (item) => item.textContent == 'playlistSearchArtists.artistSearch.empty'
      );
    expect(emptySearchItem).toBeInTheDocument();
  });

});
