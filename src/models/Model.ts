import { NonFunctionKeys } from 'utility-types';
import {
  addQueryFilter, apiRequest, HttpMethod, QueryFilter,
} from '../utils/helpers';
import { API_BASE_URL } from '../config/env';

type ModelIdType = number | string;

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

interface ModelClass<T extends Model> {
  new(data: SchemaOf<T>): T;

  config: ModelConfig;
}

export abstract class Model {
  protected static config: ModelConfig;

  id!: string | number;

  constructor(data: SchemaOf<Model>) {
    Object.assign(this, data);
  }

  static async find<T extends Model>(this: ModelClass<T>, filter?: QueryFilter): Promise<T[]> {
    let baseUrl = `${API_BASE_URL}/${this.config.endpoint}`;
    if (filter) baseUrl = addQueryFilter<T>(baseUrl, filter);
    const response = await apiRequest<T>(baseUrl);
    return response.data?.map((object: T) => new this(object));
  }

  static async findById<T extends Model>(this: ModelClass<T>, id: ModelIdType): Promise<T> {
    const response = await apiRequest<T>(`${API_BASE_URL}/${this.config.endpoint}/${id}`);
    return new this(response.data);
  }

  static async create<T extends Model>(this: ModelClass<T>, dataOrModel: Partial<SchemaOf<T>> | T): Promise<T> {
    const response = await apiRequest(`${API_BASE_URL}/${this.config.endpoint}`, HttpMethod.POST, dataOrModel);
    return new this(response.data);
  }

  static async updateById<T extends Model>(this: ModelClass<T>, model: T): Promise<T>;

  static async updateById<T extends Model>(this: ModelClass<T>, id: ModelIdType, data: Partial<SchemaOf<T>>): Promise<T>;

  static async updateById<T extends Model>(this: ModelClass<T>, idOrModel: ModelIdType | T, data?: Partial<SchemaOf<T>>): Promise<T> {
    let id = idOrModel;
    if (idOrModel && typeof idOrModel === 'object') {
      id = idOrModel.id;
      data = idOrModel;
    }
    const response = await apiRequest(`${API_BASE_URL}/${this.config.endpoint}/${id}`, HttpMethod.PUT, data);
    return new this(response.data);
  }

  static async deleteById(id: ModelIdType): Promise<boolean> {
    const response = await apiRequest(`${API_BASE_URL}/${this.config.endpoint}/${id}`, HttpMethod.DELETE);
    return response.status_code === 200;
  }

  async save<T extends Model>(): Promise<T> {
    await apiRequest(`${API_BASE_URL}/${this.modelClass.config.endpoint}/${this.id}`, HttpMethod.PUT, this);
    return this as unknown as T;
  }

  async update<T extends Model>(data: Partial<SchemaOf<T>>): Promise<T> {
    Object.assign(this, data);
    return this.save();
  }

  async remove(): Promise<void> {
    await apiRequest(`${API_BASE_URL}/${this.modelClass.config.endpoint}/${this.id}`, HttpMethod.DELETE);
  }

  get modelClass(): typeof Model {
    return this.constructor as typeof Model;
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
