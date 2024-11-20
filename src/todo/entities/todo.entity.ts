import { BaseEntity } from "src/common/base-entity";
import { Column, Entity } from "typeorm";
import { TodoStatusEnum } from "../todo-status.enum";

@Entity('todo')
export class TodoEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'enum', enum: TodoStatusEnum, default: TodoStatusEnum.waiting })
    status: TodoStatusEnum;
}