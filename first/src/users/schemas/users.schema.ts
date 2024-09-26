import { Prop, Schema } from "@nestjs/mongoose";
import { Base } from "src/common/schemas";


@Schema({
    toJSON: { virtuals: true, getters: true},
    toObject: { virtuals: true, getters: true },
})

export class User extends Base {
  @Prop({required: true, unique: true })
  email: string;

  @Prop({required:true,})
  password: string;

  @Prop()
  otp:number

}