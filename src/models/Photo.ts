import { Model } from './Model';

class Photo extends Model {
  albumId!: number;

  title!: string;

  url!: string;

  thumbnailUrl?: string;

  protected static config = {
    endpoint: 'photos',
  };
}

export default Photo;
