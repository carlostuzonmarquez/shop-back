import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { PhotoModule } from './photo/photo.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    CategoryModule,
    ProductModule,
    PhotoModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),  // Servir archivos desde 'uploads'
      serveRoot: '/uploads',  // URL base para acceder a los archivos
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Permite que las variables estén disponibles en toda la app
    }),
    UserModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
