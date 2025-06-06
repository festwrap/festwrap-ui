'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronsUpDownIcon, SearchIcon, XIcon } from 'lucide-react';
import ArtistSearchResult from './ArtistSearchResult';
import { ArtistDTO } from '@/entities/artists';
import useTranslation from 'next-translate/useTranslation';

type SearchComboboxProps = {
  options: ArtistDTO[];
  values: ArtistDTO[];
  onChange: (_value: ArtistDTO) => void;
  onSearch: (_search: string) => void;
  isSearching: boolean;
  hasError: boolean;
};

export function SearchArtistsCombobox({
  options,
  values,
  onChange,
  onSearch,
  isSearching,
  hasError,
}: SearchComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { t } = useTranslation('generate');

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      listRef.current &&
      !listRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleInputToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
    setSearch(e.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleItemSelect = (item: ArtistDTO) => {
    onChange(item);

    // Ensure closure after all updates
    setSearch('');
    setTimeout(() => setIsOpen(false), 0);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleItemSelect(options[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === 'Tab' && isOpen) {
      e.preventDefault();
    }
  };

  const clearSearch = () => {
    setSearch('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current && activeIndex >= 0) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem && typeof activeItem.scrollIntoView === 'function') {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  return (
    <div className="w-full">
      <div
        className="relative w-full"
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
      >
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary h-5 w-5" />
          <input
            ref={inputRef}
            type="text"
            role="textbox"
            value={search}
            onChange={handleInputChange}
            onMouseDown={handleInputToggle}
            className="w-full rounded-full bg-white px-12 py-3 border-2 border-secondary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="combobox-items"
            data-testid="artist-search-input"
          />
          {search && (
            <button
              className="absolute right-12 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <XIcon className="h-5 w-5 text-gray-400" />
            </button>
          )}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle options"
          >
            <ChevronsUpDownIcon className="h-5 w-5 text-secondary" />
          </button>
        </div>
        {isOpen && (
          <ul
            ref={listRef}
            id="combobox-items"
            role="listbox"
            className="absolute z-10 w-full mt-2 bg-white border border-secondary rounded-xl shadow-lg max-h-60 overflow-auto py-3"
          >
            {isSearching ? (
              <li className="px-4 py-2 text-secondary" role="status">
                {t('playlistSearchArtists.artistSearch.searching')}
              </li>
            ) : !search ? (
              <li className="px-4 py-2 text-secondary" role="status">
                {t('playlistSearchArtists.artistSearch.empty')}
              </li>
            ) : hasError ? (
              <li
                className="px-4 py-2 text-red-400"
                role="alert"
              >
                {t('errors.artistSearch.unexpectedError')}
              </li>
            ) : options.length === 0 ? (
              <li className="px-4 py-2 text-secondary">
                {t('playlistSearchArtists.artistSearch.noResults')}
              </li>
            ) : (
              options.map((item, index) => (
                <ArtistSearchResult
                  key={index}
                  name={item.name}
                  isActive={index === activeIndex}
                  isSelected={values.some(
                    (selectedItem) => selectedItem.name === item.name
                  )}
                  handleItemSelect={() => handleItemSelect(item)}
                  imageUrl={item.imageUri}
                />
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
