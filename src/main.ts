import { App } from './app/app';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await App.createApp();
  await app.listen(PORT);
}
bootstrap();
