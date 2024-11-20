import { TodoStatusEnum } from "../todo-status.enum";

export class Todo {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    status: TodoStatusEnum;
}
