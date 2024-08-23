import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema({ timestamps: true })
export class Subscriber {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  skills: string[];

  @Prop()
  createdAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: string;
    email: string;
  };

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  updatedBy: {
    _id: string;
    email: string;
  };

  @Prop()
  deleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  deletedBy: {
    _id: string;
    email: string;
  };
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
