import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { generateCacheKey } from '../utils/helper';


export function cache(key: string): any {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Inject(CACHE_MANAGER)(target, "injectedCacheManager");

    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
     let cacheManager: Cache = this["injectedCacheManager"];

      const addedArgs = JSON.stringify(args);
      const newKey = generateCacheKey(key, args);
      const cacheResult = await cacheManager.get(newKey);
      if (cacheResult) {
        return cacheResult;
      }

      const result = await originalMethod.apply(this, args);
      await cacheManager.set(newKey, result, 0);
      return result;
    };
    return descriptor;
  };
}



