import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './auth/entities/user.entity';
import { Role } from './auth/entities/role.entity';
import { ProxyModule } from './proxy/proxy.module'; // Importa el ProxyModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Permite que las variables de entorno estén disponibles en toda la aplicación
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'luis0512',
      database: 'lumos_db',
      autoLoadEntities: true,  // Carga automáticamente las entidades
      synchronize: true,       // Sincroniza la base de datos (solo en desarrollo)
      entities: [User, Role],  
    }),
    AuthModule,
    ProxyModule, // Agrega el ProxyModule aquí
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}