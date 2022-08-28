import { IsNotEmpty } from "class-validator"

export class CreateEndpointDto {
  title: string
  notificationMessage: string

  @IsNotEmpty()
  rule: string
}
