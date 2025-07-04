import { type Playlist } from '@/App';
import { Card, CardContent } from '@/components/ui/card';
import { quran, type ChapterId } from '@quranjs/api';
import {
  BookOpen,
  Loader,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface AudioPlayerProps {
  playlist: Playlist;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export const AudioPlayer = ({
  playlist,
  isPlaying,
  onPlay,
  onPause,
}: AudioPlayerProps) => {
  const [progress, setProgress] = useState([0]);
  const [volume, setVolume] = useState([10]);
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    async function fetchAudioData() {
      try {
        setIsLoading(true);
        const currentSurahId = playlist.surahs[currentSurahIndex]
          ?.id as ChapterId;

        const res = await quran.v4.audio.findChapterRecitationById(
          currentSurahId,
          String(playlist.reciter.id)
        );

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current.load();
        }

        const newAudio = new Audio(res.audioUrl);
        newAudio.volume = volume[0] / 100;
        console.log(newAudio);

        newAudio.onloadeddata = () => {
          newAudio.play();
          onPlay();
          setIsLoading(false);
        };

        newAudio.ontimeupdate = () => {
          setCurrentTime(newAudio.currentTime);
          setDuration(newAudio.duration || 0);
          const percentage = (newAudio.currentTime / newAudio.duration) * 100;
          setProgress([isNaN(percentage) ? 0 : percentage]);
        };

        newAudio.onended = () => {
          if (currentSurahIndex < playlist.surahs.length - 1) {
            setCurrentSurahIndex((prev) => prev + 1);
          } else {
            onPause();
          }
        };

        audioRef.current = newAudio;
      } catch (error: unknown) {
        console.error(error);
        alert('Error fetching audio data');
        setIsLoading(false);
      }
    }

    fetchAudioData();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    };
  }, [playlist, currentSurahIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration) {
      const seekTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setProgress(value);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentSurah = playlist.surahs[currentSurahIndex];

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      onPause();
    } else {
      audio.play();
      onPlay();
    }
  };

  const handleNext = () => {
    if (currentSurahIndex < playlist.surahs.length - 1) {
      setCurrentSurahIndex(currentSurahIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSurahIndex > 0) {
      setCurrentSurahIndex(currentSurahIndex - 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border p-2">
      <Card className="max-w-6xl mx-auto max-h-[200px]">
        <CardContent className="p-1">
          <div className="flex gap-3 flex-col md:flex-row md:justify-between ">
            {/* Now Playing Info */}
            <div className="flex">
              <div className="rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-primary truncate">
                  {currentSurah.name}
                </h4>
                <p className="text-sm text-muted-foreground truncate font-arabic">
                  {currentSurah.arabicName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {playlist?.reciter?.name} • {playlist.name}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col flex-1 items-center space-y-2">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentSurahIndex === 0}
                >
                  <SkipBack className="w-3 h-3" />
                </Button>

                <Button
                  size="sm"
                  className="w-12 h-12 gradient-islamic text-white hover:opacity-90"
                  onClick={handlePlayPause}
                >
                  {isLoading ? (
                    <Loader className="w-3 h-3 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentSurahIndex === playlist.surahs.length - 1}
                >
                  <SkipForward className="w-3 h-3" />
                </Button>
              </div>

              <div className="w-full max-w-xs flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={progress}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="text-xs text-muted-foreground">
                {currentSurahIndex + 1} of {playlist.surahs.length}
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-end space-x-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
