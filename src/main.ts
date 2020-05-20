import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import helmet from 'helmet';

import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(
    cors({
      origin: '*',
    })
  );

  await app.listen(8000, '0.0.0.0');
})();
