import { Model } from './Model';

class Photo extends Model {
  id: number;

  albumId: number;

  title: string;

  url: string;

  thumbnailUrl?: string;

  protected static config = {
    endpoint: 'photos',
  };

  constructor(id: number, albumId: number, title: string, url: string) {
    super();
    this.id = id;
    this.albumId = albumId;
    this.title = title;
    this.url = url;
  }
}

export default Photo;
