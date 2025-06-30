import { type Playlist, type Surah } from '@/App';
import ALL_SURAHS from '@/chapters.json';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RECITERS from '@/reciters.json';
import { useState } from 'react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt'>) => void;
}

interface ReciterType {
  id: number;
  name: string;
}

export const CreatePlaylistModal = ({
  isOpen,
  onClose,
  onCreatePlaylist,
}: CreatePlaylistModalProps) => {
  const [name, setName] = useState('');
  const [reciter, setReciter] = useState<ReciterType | null>(null);
  const [selectedSurahs, setSelectedSurahs] = useState<Surah[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && reciter && selectedSurahs.length > 0) {
      onCreatePlaylist({
        name,
        reciter,
        surahs: selectedSurahs,
      });
      // Reset form
      setName('');
      setReciter(null);
      setSelectedSurahs([]);
    }
  };

  const handleSurahToggle = (surah: Surah, checked: boolean) => {
    if (checked) {
      setSelectedSurahs([...selectedSurahs, surah]);
    } else {
      setSelectedSurahs(selectedSurahs.filter((s) => s.id !== surah.id));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            Create New Playlist
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Playlist Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter playlist name"
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="reciter">Select Reciter</Label>
              <Select
                value={reciter?.name}
                onValueChange={(value) => {
                  const selectedReciter = RECITERS.find(
                    (r) => r.name === value
                  );
                  setReciter(
                    selectedReciter
                      ? {
                          id: selectedReciter.reciter_id,
                          name: selectedReciter.name,
                        }
                      : null
                  );
                }}
                required
              >
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder="Choose a reciter" />
                </SelectTrigger>
                <SelectContent>
                  {RECITERS.map((reciter) => (
                    <SelectItem key={reciter.reciter_id} value={reciter.name}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Surahs ({selectedSurahs.length} selected)</Label>
              <ScrollArea className="h-64 border rounded-md p-4 mt-2">
                <div className="space-y-3">
                  {ALL_SURAHS.map((surah) => {
                    const isSelected = selectedSurahs.some(
                      (s) => s.id === surah.id
                    );
                    return (
                      <div
                        key={surah.id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`surah-${surah.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSurahToggle(surah, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`surah-${surah.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {surah.id}. {surah.name}
                              </span>
                              <span className="text-sm text-muted-foreground font-arabic ml-2">
                                {surah.arabicName}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {surah.verses} verses
                            </span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-islamic text-white"
              disabled={!name || !reciter || selectedSurahs.length === 0}
            >
              Create Playlist
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
