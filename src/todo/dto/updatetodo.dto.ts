import { IsEnum, IsOptional, IsString, Max, Min } from "class-validator";
import { maxLengthErrorMessage, minLengthErrorMessage } from "src/common/errors";
import { TodoStatusEnum } from "../todo-status.enum";

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @Min(3, minLengthErrorMessage(3))
  @Max(10, maxLengthErrorMessage(10))
  name?: string;

  @IsString()
  @IsOptional()
  @Min(10, minLengthErrorMessage(10))
  description?: string;

  @IsEnum(TodoStatusEnum)
  @IsOptional()
  status?: TodoStatusEnum;
}