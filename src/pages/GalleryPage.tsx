import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { TOURNAMENTS, GALLERY_PHOTOS, GalleryPhoto } from '@/data/mockData';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [filterTournament, setFilterTournament] = useState('all');

  const completedTournaments = TOURNAMENTS.filter(t => t.status === 'completed');
  const allPhotos = GALLERY_PHOTOS;

  const filtered = filterTournament === 'all'
    ? allPhotos
    : allPhotos.filter(p => p.tournamentId === Number(filterTournament));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-oswald text-3xl font-bold text-tennis-green">Галерея турниров</h1>
          <p className="text-muted-foreground">Фото с прошедших соревнований</p>
        </div>
      </div>

      {/* Filter by tournament */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilterTournament('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterTournament === 'all' ? 'bg-tennis-green text-white' : 'bg-white border border-border text-muted-foreground hover:text-foreground'}`}
        >
          Все турниры
        </button>
        {completedTournaments.map(t => (
          <button
            key={t.id}
            onClick={() => setFilterTournament(String(t.id))}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterTournament === String(t.id) ? 'bg-tennis-green text-white' : 'bg-white border border-border text-muted-foreground hover:text-foreground'}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Photo grid by tournament */}
      {completedTournaments.length === 0 || allPhotos.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Camera" size={36} className="text-muted-foreground opacity-40" />
          </div>
          <h3 className="font-bold text-lg mb-2">Фото пока нет</h3>
          <p className="text-muted-foreground text-sm">Фотографии с турниров появятся после проведения соревнований</p>
        </div>
      ) : (
        <div className="space-y-10">
          {completedTournaments
            .filter(t => t.photos && t.photos.length > 0)
            .filter(t => filterTournament === 'all' || t.id === Number(filterTournament))
            .map(tournament => (
              <div key={tournament.id}>
                {/* Tournament header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-oswald text-xl font-bold text-foreground">{tournament.name}</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={13} />{tournament.city}</span>
                      <span className="flex items-center gap-1"><Icon name="Calendar" size={13} />{new Date(tournament.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>{tournament.photos.length} фото</span>
                    </div>
                  </div>
                  <Link
                    to={`/tournament/${tournament.id}`}
                    className="text-sm font-semibold text-tennis-green hover:underline flex items-center gap-1"
                  >
                    К турниру <Icon name="ChevronRight" size={15} />
                  </Link>
                </div>

                {/* Photos grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {tournament.photos.map(photo => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative overflow-hidden rounded-xl aspect-square bg-muted card-hover"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="ZoomIn" size={24} className="text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {/* If filter shows no photos */}
          {filterTournament !== 'all' && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="ImageOff" size={36} className="mx-auto mb-3 opacity-40" />
              <div>Фото для этого турнира ещё не добавлены</div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-black border-0">
          {selectedPhoto && (
            <div>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="p-4 text-white">
                <div className="font-semibold">{selectedPhoto.caption}</div>
                <div className="text-white/60 text-sm mt-1">{selectedPhoto.tournamentName} · {new Date(selectedPhoto.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
