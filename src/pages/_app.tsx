import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import RootLayout from '@/components/layout/root-layout';
import {
  ServiceContextType,
  ServiceProvider,
} from '@/contexts/service-context';
import { FetchService } from '@/services/fetch-service';
import { PlaylistsService } from '@/services/playlists-service';
import { ArtistsService } from '@/services/artists-service';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const fetchService = new FetchService();
const playlistsService = new PlaylistsService(fetchService);
const artistsService = new ArtistsService(fetchService);

const servicesValue: ServiceContextType = {
  playlistsService,
  artistsService,
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ServiceProvider value={servicesValue}>
      <main className={poppins.className}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </main>
    </ServiceProvider>
  );
}
