import { IsNotEmpty, IsString, Max, Min, ValidationArguments } from "class-validator";
import { RequiredFieldErrorMessage, maxLengthErrorMessage, minLengthErrorMessage } from "src/common/errors";

export class AddTodoDto {
  @IsString()
  @IsNotEmpty(RequiredFieldErrorMessage( {targetName: 'name'} as ValidationArguments))
  @Min(3, minLengthErrorMessage(3))
  @Max(10, maxLengthErrorMessage(10))
  name: string;

  @IsString()
  @IsNotEmpty(RequiredFieldErrorMessage( {targetName: 'name'} as ValidationArguments))
  @Min(10, minLengthErrorMessage(10))
  description: string;
}