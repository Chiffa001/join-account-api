import { InjectionToken, ModuleMetadata } from '@nestjs/common';

export interface ModuleAsyncOptions<T> extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => Promise<T> | T;
  inject?: InjectionToken[];
}
