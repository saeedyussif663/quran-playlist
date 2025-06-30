import { Book } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-[#fffc] backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#065f46] to-[#047857] rounded-xl flex items-center justify-center">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold  text-primary font-arabic">
              القرآن الكريم
            </h1>
            <span className="text-sm text-muted-foreground">
              Quran Playlists
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
