import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule, RmqModule } from "@app/common";
import * as Joi from 'joi';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from "./orders.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./order.schema";
import { BILLING_SERVICES } from "./constants/services";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/orders/.env'
    }),
    DatabaseModule,
    MongooseModule.forFeature([{
      name: Order.name,
      schema: OrderSchema,
    }]),
    RmqModule.register({
      name: BILLING_SERVICES,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
