import { IArtistsService } from '@/services/artists-service';
import { IPlaylistsService } from '@/services/playlists-service';
import { createContext, useContext, ReactNode } from 'react';

export interface ServiceContextType {
  playlistsService: IPlaylistsService;
  artistsService: IArtistsService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

type ServiceProviderProps = {
  children: ReactNode;
  value: ServiceContextType;
};

export const ServiceProvider = ({ children, value }: ServiceProviderProps) => {
  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
};

// Custom hook to access services
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context)
    throw new Error('useServices must be used within a ServiceProvider');
  return context;
};
