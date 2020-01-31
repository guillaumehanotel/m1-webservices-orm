import { NonFunctionKeys } from 'utility-types';
import { apiRequest, HttpMethod } from '../utils/helpers';
import { API_URL } from '../config/env';

type ModelIdType = number | string;

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

interface ModelClass<T extends Model> {
  new(data: SchemaOf<T>): T;

  config: ModelConfig;

}

export abstract class Model {
  protected static config: ModelConfig;

  id!: string | number;

  static async find<T extends Model>(this: ModelClass<T>): Promise<T[]> {
    const response = await apiRequest<T>(`${API_URL}/${this.config.endpoint}`);
    return response.data?.map((object: T) => new this(object));
  }

  static async findById<T extends Model>(this: ModelClass<T>, id: ModelIdType): Promise<T> {
    const response = await apiRequest<T>(`${API_URL}/${this.config.endpoint}/${id}`);
    return new this(response.data);
  }

  static async create<T extends Model>(this: ModelClass<T>, dataOrModel: Partial<SchemaOf<T>> | T): Promise<T> {
    const response = await apiRequest(`${API_URL}/${this.config.endpoint}`, HttpMethod.POST, dataOrModel);
    return new this(response.data);
  }

  static async updateById<T extends Model>(this: ModelClass<T>, model: T): Promise<T> {
    const response = await apiRequest(`${API_URL}/${this.config.endpoint}/${model.id}`, HttpMethod.PUT, model);
    return new this(response.data);
  }

  static async deleteById(id: ModelIdType): Promise<boolean> {
    const response = await apiRequest(`${API_URL}/${this.config.endpoint}/${id}`, HttpMethod.DELETE);
    return response.status_code === 200;
  }
}


interface ModelConfig {
  /**
   * The endpoint on the remote API, example 'users'
   */
  endpoint: string;

  /**
   * The definition of the relations
   */
  relations?: Record<string, Relation>;
}

enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}


/**
 * Define the configuration of a relation
 */
interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType;

  /** The target Model */
  model: typeof Model;

  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string;
}
