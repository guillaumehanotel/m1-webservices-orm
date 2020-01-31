import { NonFunctionKeys } from 'utility-types';

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;
// -> une interface avec les clefs et les types du modèle T


enum QueryFilterOrder {
  Asc = 'asc',
  Desc = 'desc',
}

interface QueryFilter {
  where?: Record<string, any>;
  limit?: number;
  page?: number;
  sort?: string;
  order?: QueryFilterOrder;
}


interface FindByIdOptions {
  includes: string[];
}

type ModelIdType = number | string;

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

declare abstract class Model {
  protected static config: ModelConfig;

  id: string | number;

  static create<T extends Model>(dataOrModel: SchemaOf<T> | T): Promise<T[]>;

  static find<T extends Model>(filter?: QueryFilter): Promise<T[]>;

  static findById<T extends Model>(id: ModelIdType, options?: FindByIdOptions): Promise<T>;

  static updateById<T extends Model>(model: T): Promise<T[]>;

  static updateById<T extends Model>(id: ModelIdType, data: Partial<SchemaOf<T>>): Promise<T[]>;

  static deleteById(id: ModelIdType): Promise<boolean>;

  /**
   * Push changes that has occured on the instance
   */
  save<T extends Model>(): Promise<T>;

  /**
   * Push given changes, and update the instance
   */
  update<T extends Model>(data: Partial<SchemaOf<T>>): Promise<T>;

  /**
   * Remove the remote data
   */
  remove(): Promise<void>;
}
