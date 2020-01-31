import { Model } from './Model';
import User from './User';
import { Relation, RelationType } from '../utils/helpers';


interface AlbumSchema {
  userId: number;
  title: string;
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
    } as Record<string, Relation>,
  };

  userId!: number;

  title!: string;
}

export default Album;
