'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronsUpDownIcon, SearchIcon, XIcon } from 'lucide-react';
import { StaticImageData } from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import BandSearchResult from './BandSearchResult';

export interface SearchedArtist {
  id: number;
  title: string;
  icon: StaticImageData;
}

interface SearchComboboxProps {
  onArtistSearch: (_name: string) => Promise<SearchedArtist[]>;
  onSelectionChange: (_values: SearchedArtist[]) => void;
  searchPlaceholder: string;
}

export function SearchBandsCombobox({
  onArtistSearch,
  onSelectionChange,
  searchPlaceholder,
}: SearchComboboxProps) {
  const { t } = useTranslation('generate');
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<SearchedArtist[]>([]);
  const [filteredItems, setFilteredItems] = useState<SearchedArtist[]>([]);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (isOpen && listRef.current && activeIndex >= 0) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem && typeof activeItem.scrollIntoView === 'function') {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      listRef.current &&
      !listRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    } else {
    }
  };

  const handleInputToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    if (e.target.value.length <= 1) {
      updateSearchResults([], t('steps.step2.errors.shortArtistName'));
      return;
    }

    await onArtistSearch(e.target.value)
      .then((artists) => {
        if (artists.length === 0) {
          updateSearchResults([], t('steps.step2.errors.noResults'));
        } else {
          updateSearchResults(artists);
        }
      })
      .catch((_) => {
        updateSearchResults([], t('steps.step2.errors.search'));
        return;
      });
  };

  const updateSearchResults = (
    searchResults: SearchedArtist[],
    error?: string
  ) => {
    if (searchResults.length > 0) {
      setIsOpen(true);
      setActiveIndex(-1);
    } else if (error) {
      setIsOpen(true);
    }
    setFilteredItems(searchResults);
    setSearchError(error || '');
  };

  const handleItemSelect = (item: SearchedArtist) => {
    const newSelectedItems = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    )
      ? selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      : [...selectedItems, item];

    setSelectedItems(newSelectedItems);
    onSelectionChange(newSelectedItems);

    // Ensure closure after all updates
    setSearch('');
    updateSearchResults([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        moveActiveArtistDown();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActiveArtistUp();
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectCurrentArtist();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Tab' && isOpen) {
      e.preventDefault();
    }
  };

  const selectCurrentArtist = () => {
    handleItemSelect(filteredItems[activeIndex]);
  };

  const moveActiveArtistUp = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const moveActiveArtistDown = () => {
    setActiveIndex((prev) =>
      prev < filteredItems.length - 1 ? prev + 1 : prev
    );
  };

  const clearSearch = () => {
    setSearch('');
    updateSearchResults([]);
    inputRef.current?.focus();
  };

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
            value={search}
            onChange={handleInputChange}
            onMouseDown={handleInputToggle}
            className="w-full rounded-full bg-white px-12 py-3 border-2 border-secondary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            placeholder={searchPlaceholder}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="combobox-items"
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
        {isOpen && (filteredItems.length > 0 || searchError !== '') && (
          <ul
            ref={listRef}
            id="combobox-items"
            role="listbox"
            className="absolute z-10 w-full mt-2 bg-white border border-secondary rounded-xl shadow-lg max-h-60 overflow-auto py-3"
          >
            {searchError !== '' ? (
              <li className="px-4 py-2 text-secondary">{searchError}</li>
            ) : (
              <li></li>
            )}
            {filteredItems.map((item, index) => (
              <BandSearchResult
                key={item.id}
                name={item.title}
                isActive={index === activeIndex}
                isSelected={selectedItems.some(
                  (selectedItem) => selectedItem.id === item.id
                )}
                handleItemSelect={() => handleItemSelect(item)}
                icon={item.icon}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
