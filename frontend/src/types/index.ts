export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumId: string | null;
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
}
