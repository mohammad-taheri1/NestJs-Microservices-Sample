import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://cpyhnstr:p14Qi4txm4ayGThFcL_4uwwaTdwizEcQ@rat.rmq2.cloudamqp.com/cpyhnstr',
      ],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
}
bootstrap();
