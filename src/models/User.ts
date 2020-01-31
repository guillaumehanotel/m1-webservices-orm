import { Model } from './Model';

class User extends Model {
  id: number;

  name: string;

  username: string;

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
  };

  constructor(id: number, name: string, username: string) {
    super();
    this.id = id;
    this.name = name;
    this.username = username;
  }
}

export default User;
