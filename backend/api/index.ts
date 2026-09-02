import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
const express = require('express');

const expressApp = express();

let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    app.enableCors({ origin: '*', credentials: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    cachedApp = app;
  }
}

export default async function (req, res) {
  try {
    await bootstrap();
    expressApp(req, res);
  } catch (error) {
    console.error('Bootstrap Error:', error);
    res.status(500).json({
      message: 'Internal Server Error during bootstrap',
      error: error.message,
      stack: error.stack
    });
  }
}
