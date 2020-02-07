import fetch from 'node-fetch';
import { NonFunctionKeys } from 'utility-types';
import { ServerUnreachableError } from './errors';
import { Model } from '../models/Model';

export enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}

export type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

export interface FindByIdOptions {
  includes: string[];
}

export enum QueryFilterOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface QueryFilter {
  where?: Record<string, any>;
  limit?: number;
  page?: number;
  sort?: string;
  order?: QueryFilterOrder;
}

export function addQueryFilter<T extends Model>(baseUrl: string, filter: QueryFilter): string {
  baseUrl += '?';
  if (filter.where) {
    for (const key in filter.where) {
      if (filter.where.hasOwnProperty(key) && filter.where[key]) {
        baseUrl += `${key}=${filter.where[key]}&`;
      }
    }
  }
  if (filter.limit) baseUrl += `_limit=${filter.limit}&`;
  if (filter.page) baseUrl += `_page=${filter.page}&`;
  if (filter.sort) baseUrl += `_sort=${filter.sort}&`;
  if (filter.order) baseUrl += `_order=${filter.order}&`;

  return encodeURI(baseUrl).slice(0, -1);
}

export interface ModelConfig {
  /**
   * The endpoint on the remote API, example 'users'
   */
  endpoint: string;

  /**
   * The definition of the relations
   */
  relations?: Record<string, Relation>;
}

/**
 * Define the configuration of a relation
 */
export interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType;

  /** The target Model */
  model: any;

  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string;
}

export const enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export interface ApiResponse<T extends object> {
  data: SchemaOf<T> | any;
  status_code: number;
}

export const apiRequest = async <T extends Model>(
  url: string,
  method = HttpMethod.GET,
  bodyParams?: object | null,
  bearerToken?: string,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
      },
      body: bodyParams ? JSON.stringify(bodyParams) : undefined,
    });
    let data = null;
    if (response.status !== 204) {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
    }
    return {
      data,
      status_code: response.status,
    };
  } catch (e) {
    if (e.code === 'ECONNREFUSED') {
      throw new ServerUnreachableError('The API is unreachable, is the server up ?');
    } else {
      throw new Error(e.message);
    }
  }
};

// export const handleApiErrors = (response: ApiResponse<any>): void => {
//   if (response.status_code === 200 || response.status_code === 204) {
//     return;
//   }
//   if (response.status_code === 401) {
//     throw new UnauthorizedError(response.data);
//   } else if (response.status_code === 404) {
//     throw new NotFoundError(response.data);
//   } else if (response.status_code === 422) {
//     throw new FormValidationError(response.data);
//   } else if (response.status_code === 500) {
//     console.error(response.data);
//   } else {
//     console.error(response.status_code);
//     console.error(response);
//   }
// };
