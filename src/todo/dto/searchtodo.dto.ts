import { IsOptional } from "class-validator";
import { TodoStatusEnum } from "../todo-status.enum";

export class SearchTodoDto {
    @IsOptional()
    criteria: string;
    @IsOptional()
    status: TodoStatusEnum;
}