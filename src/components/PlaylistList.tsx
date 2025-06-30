import { type Playlist } from '@/App';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Music, Pause, Play, Trash2 } from 'lucide-react';

interface PlaylistListProps {
  playlists: Playlist[];
  onDeletePlaylist: (playlistId: string) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  currentPlaylist: Playlist | null;
  isPlaying: boolean;
}

export const PlaylistList = ({
  playlists,
  onDeletePlaylist,
  onPlayPlaylist,
  currentPlaylist,
  isPlaying,
}: PlaylistListProps) => {
  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
          No playlists yet
        </h3>
        <p className="text-muted-foreground">
          Create your first playlist to get started
        </p>
      </div>
    );
  }

  const isCurrentPlaylist = (playlist: Playlist) => {
    return currentPlaylist?.id === playlist.id;
  };

  return (
    <div className="space-y-6 mb-20">
      {playlists.map((playlist) => (
        <Card key={playlist.id} className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-xl text-primary">
                  {playlist.name}
                </CardTitle>
                <div className="flex flex-col md:flex-row gap-2 md:items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Music className="w-4 h-4" />
                    <span>{playlist.surahs.length} surahs</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {playlist?.reciter.name}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPlayPlaylist(playlist)}
                  className={`${
                    isCurrentPlaylist(playlist) && isPlaying
                      ? 'bg-primary/10 text-primary'
                      : 'text-primary hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {isCurrentPlaylist(playlist) && isPlaying ? (
                    <Pause className="w-4 h-4 mr-1" />
                  ) : (
                    <Play className="w-4 h-4 mr-1" />
                  )}
                  {isCurrentPlaylist(playlist) && isPlaying
                    ? 'Playing'
                    : 'Play'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeletePlaylist(String(playlist.id))}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="surahs" className="border-none">
                <AccordionTrigger className="hover:no-underline text-left">
                  <span className="text-sm font-medium">
                    View Surahs ({playlist.surahs.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {playlist.surahs.map((surah) => (
                      <div
                        key={surah.id}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-primary">
                            {surah.id}. {surah.name}
                          </h4>
                          <p className="text-sm text-muted-foreground font-arabic">
                            {surah.arabicName}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {surah.verses} verses
                        </Badge>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
