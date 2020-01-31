import fetch from 'node-fetch';
import { NonFunctionKeys } from 'utility-types';
import {
  FormValidationError, ServerUnreachableError, UnauthorizedError, NotFoundError,
} from './errors';
import { Model } from '~/models/Model';

export const enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

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
