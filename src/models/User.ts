import { Model } from './Model';
import { Relation, RelationType, SchemaOf } from '../utils/helpers';
import Album from './Album';

class User extends Model {
  name!: string;

  username!: string;

  email?: string;

  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: number; lng: number };
  };

  phone?: string;

  website?: string;

  company?: { name: string; catchPhrase: string; bs: string };

  protected static config = {
    endpoint: 'users',
    relations: {
      user: {
        type: RelationType.HasMany,
        model: Album,
        foreignKey: 'userId',
      },
    } as Record<string, Relation>,
  };
}

export default User;
