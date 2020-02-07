import { NonFunctionKeys } from 'utility-types';
import {
  addQueryFilter, apiRequest, FindByIdOptions, HttpMethod, ModelConfig, QueryFilter, RelationType,
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

  static async findById<T extends Model>(this: ModelClass<T>, id: ModelIdType, options?: FindByIdOptions): Promise<T> {
    const response = await apiRequest<T>(`${API_BASE_URL}/${this.config.endpoint}/${id}`);
    let object: T = new this(response.data);
    object = await Model.loadIncludes(object, this.config, options);
    return object;
  }

  static async loadIncludes<T extends Model>(object: T, config: ModelConfig, options?: FindByIdOptions): Promise<T> {
    if (options && options.includes.length && config.relations) {
      const { relations } = config;
      for (const include of options.includes) {
        if (config.relations[include]) {
          const relation = relations[include];

          // on suppose que le 'include' (le nom de la relation) correspond au nom de la propriété de la classe

          // on détermine le type de la relation que l'on veut faire
          type subRelationType = typeof relation.model;
          // on récupère la propriété de la classe qui accueillera la relation, en castant le nom de la relation en 'clé de T'
          const subRelation: keyof T = include as keyof T;
          const foreignKeyName = relation.foreignKey as keyof T; // 'userId'

          if (relation.type === RelationType.HasMany) {
            const url = `${API_BASE_URL}/${relation.model.config.endpoint}?${foreignKeyName}=${object.id}`;
            const relationResponse = await apiRequest(url);
            object[subRelation] = relationResponse.data as subRelationType;
          } else if (relation.type === RelationType.BelongsTo) {
            const foreignKeyValue = object[foreignKeyName]; // album.userId = 1
            const relationResponse = await apiRequest(`${API_BASE_URL}/${relation.model.config.endpoint}/${foreignKeyValue}`);
            object[subRelation] = relationResponse.data as subRelationType;
          }
        }
      }
    }
    return object;
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
