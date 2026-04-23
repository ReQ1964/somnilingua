import { useMemo } from 'react';
import { Configuration } from '@/api';
import { BaseAPI } from '@/api/base.ts';
import type { AxiosInstance } from 'axios';
import { api } from '@/config/api.ts';

export type NewableApi<T extends BaseAPI> = new (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance,
) => T;

function isFunction(item: unknown): item is (...args: never[]) => never {
  return typeof item === 'function';
}

function autoBind(instance: unknown): void {
  const proto = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(proto);

  for (const element of propertyNames) {
    const name = element;
    if (name === 'constructor') continue;

    const value = proto[name];
    if (isFunction(value)) {
      instance[name] = value.bind(instance);
    }
  }
}

/**
 * Inject custom axios for all queries
 */
export function createApiClient<T extends BaseAPI>(ClientClass: NewableApi<T>): T {
  const configuration = new Configuration();
  const client = new ClientClass(configuration, configuration.basePath, api);
  autoBind(client);
  return client;
}

/**
 * Hook for components
 */
export function useApiClient<T extends BaseAPI>(clientClass: NewableApi<T>): T {
  return useMemo(() => createApiClient(clientClass), [clientClass]);
}
