import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { TuitionRequestModule } from "./tuition-request/tuition-request.module";
import { ApplicationModule } from "./application/application.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TuitionRequestModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
