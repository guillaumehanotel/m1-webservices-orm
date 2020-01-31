import { NonFunctionKeys } from 'utility-types';
import { Model } from './Model';

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

interface AlbumSchema {
  userId: number;
  title: string;
}

class Album extends Model implements AlbumSchema {
  userId: number;

  title: string;

  static config = {
    endpoint: 'albums',
  };

  constructor(data: SchemaOf<Album>) {
    super();
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
  }

  get modelClass(): typeof Model {
    return this.constructor as typeof Model;
  }
}

export default Album;
