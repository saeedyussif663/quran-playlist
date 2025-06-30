import { AudioPlayer } from '@/components/AudioPlayer';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { PlaylistList } from '@/components/PlaylistList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';

export interface Surah {
  id: number;
  verses: number;
  name: string;
  arabicName: string;
}

export interface Playlist {
  id: number;
  name: string;
  reciter: {
    id: number;
    name: string;
  };
  surahs: Surah[];
  createdAt: Date;
}

const App = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const playlistsStr = localStorage.getItem('playlists');
    const lists = playlistsStr ? JSON.parse(playlistsStr) : [];
    setPlaylists(lists);
  }, []);

  const handleCreatePlaylist = (
    playlist: Omit<Playlist, 'id' | 'createdAt'>
  ) => {
    const newPlaylist: Playlist = {
      ...playlist,
      id: Date.now(),
      createdAt: new Date(),
    };
    setPlaylists([...playlists, newPlaylist]);
    localStorage.setItem(
      'playlists',
      JSON.stringify([...playlists, newPlaylist])
    );
    setIsCreateModalOpen(false);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    const updatedPlaylists = playlists.filter(
      (p) => p.id !== Number(playlistId)
    );
    setPlaylists(updatedPlaylists);
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setIsPlaying(true);
  };

  const handlePausePlaylist = () => {
    setIsPlaying(false);
  };

  const handleResumePlaylist = () => {
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-background islamic-pattern pb-40">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              My Playlists
            </h1>
            <p className="text-muted-foreground">
              Organize your favorite Quranic recitations
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gradient-islamic text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>

        <PlaylistList
          playlists={playlists}
          onDeletePlaylist={handleDeletePlaylist}
          onPlayPlaylist={handlePlayPlaylist}
          currentPlaylist={currentPlaylist}
          isPlaying={isPlaying}
        />

        <CreatePlaylistModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreatePlaylist={handleCreatePlaylist}
        />
      </main>

      {currentPlaylist && (
        <AudioPlayer
          playlist={currentPlaylist}
          isPlaying={isPlaying}
          onPlay={handleResumePlaylist}
          onPause={handlePausePlaylist}
        />
      )}
    </div>
  );
};

export default App;
