import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class AddTodoDto {
  @IsString()
  @IsNotEmpty({ message: 'The name field is required.' })
  @MinLength(3, { message: 'The name must be at least 3 characters long.' })
  @MaxLength(10, { message: 'The name must not exceed 10 characters.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'The description field is required.' })
  @MinLength(10, { message: 'The description must be at least 10 characters long.' })
  description: string;
}