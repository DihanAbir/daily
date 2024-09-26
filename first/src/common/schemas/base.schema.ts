import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Base {
    @Prop({ default: true })
    isActive: boolean;

    @Prop({default: true})
    isDeleted: boolean;

    @Prop({default: Date.now()})
    cTime: number;

    @Prop()
    cBy: string;

    @Prop()
    uTime: number;

    @Prop()
    uBy: string;
}

export const BaseSchema = SchemaFactory.createForClass(Base)