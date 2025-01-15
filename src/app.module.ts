import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [PrismaModule, CategoryModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
