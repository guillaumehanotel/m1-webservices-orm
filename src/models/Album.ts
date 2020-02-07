import { Model } from './Model';
import User from './User';
import Photo from './Photo';
import { Relation, RelationType } from '../utils/helpers';


interface AlbumSchema {
  userId: number;
  title: string;
  user: User;
  photos: Photo[];
}

class Album extends Model implements AlbumSchema {
  static config = {
    endpoint: 'albums',
    relations: {
      user: {
        type: RelationType.BelongsTo,
        model: User,
        foreignKey: 'userId',
      },
      photos: {
        type: RelationType.HasMany,
        model: Photo,
        foreignKey: 'albumId',
      },
    },
  };

  userId!: number;

  title!: string;

  readonly user!: User;

  readonly photos!: Photo[];
}

export default Album;
