import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ModuleAsyncOptions } from 'src/types/module';
import { TelegramOptions } from 'src/types/telegram';
import { TELEGRAM_MODULE } from './telegram.constants';

@Global()
@Module({})
export class TelegramModule {
  static forRootAsync(
    options: ModuleAsyncOptions<TelegramOptions>,
  ): DynamicModule {
    const asyncOptions = this.createAsyncOptionsProvider(options);
    return {
      module: TelegramModule,
      imports: options.imports,
      providers: [TelegramService, asyncOptions],
      exports: [TelegramService],
    };
  }

  private static createAsyncOptionsProvider(
    options: ModuleAsyncOptions<TelegramOptions>,
  ): Provider {
    return {
      provide: TELEGRAM_MODULE,
      useFactory: async (...args: unknown[]) => {
        const config = await options.useFactory(...args);
        return config;
      },
      inject: options.inject || [],
    };
  }
}
