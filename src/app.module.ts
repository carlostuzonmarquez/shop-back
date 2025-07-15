import { ConfigModule } from "@nestjs/config";
import { CategoryModule } from "./category/category.module";
import { PhotoModule } from "./photo/photo.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { AppService } from "./app.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    PrismaModule,
    CategoryModule,
    ProductModule,
    PhotoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
