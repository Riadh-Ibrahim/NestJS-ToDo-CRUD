import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Todo } from './entities/todo';
import { TodoStatusEnum } from './todo-status.enum';
import { AddTodoDto } from './dto/addtodo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { TodoEntity } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, SelectQueryBuilder } from 'typeorm';
import { SearchTodoDto } from './dto/searchtodo.dto';
import constants from '../constants';
import { mapAddTodoDtoToEntity, mapUpdateTodoDtoToEntity } from '.././todo/mappers/todo.mapper';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @Inject(constants.uuid) private readonly generateUUID: () => string,
  ) {}

  addTodo(newTodo: AddTodoDto): Todo {
    const { name, description } = newTodo;
    const id = this.generateUUID();
    const todo: Todo = {
      id,
      name,
      description,
      createdAt: new Date(),
      status: TodoStatusEnum.waiting,
    };
    this.todos.push(todo);
    return todo;
  }

  async addTodoV2(newTodo: AddTodoDto): Promise<TodoEntity> {
    const todo = mapAddTodoDtoToEntity(newTodo);
    return this.todoRepository.save(todo);
  }

  updateTodoById(id: string, newTodo: Partial<UpdateTodoDto>): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    Object.assign(todo, newTodo);
    return todo;
  }

  async updateTodoByIdV2(id: string, newTodo: Partial<UpdateTodoDto>) {
    const todo = await this.getTodoById(id);
    const updatedTodo = mapUpdateTodoDtoToEntity(newTodo, todo);
    return this.todoRepository.save(updatedTodo);
  }

  async deleteTodoById(id: string) {
    const todo = await this.getTodoById(id);
    this.todos = this.todos.filter((t) => t.id !== id);
    return { message: `Todo with id ${id} has been deleted`, count: 1 };
  }

  async softDeleteTodoById(id: string) {
    await this.getTodoById(id);
    return this.todoRepository.softDelete(id);
  }

  async restoreTodoById(id: string) {
    await this.getTodoById(id);
    return this.todoRepository.restore(id);
  }

  async countTodoByStatus(status: TodoStatusEnum): Promise<number> {
    return this.todoRepository.count({ where: { status } });
  }

  async getTodoStatusCount() {
    const active = await this.countTodoByStatus(TodoStatusEnum.active);
    const waiting = await this.countTodoByStatus(TodoStatusEnum.waiting);
    const done = await this.countTodoByStatus(TodoStatusEnum.done);
    return { active, waiting, done };
  }

  async getAllTodosV2() {
    return this.todoRepository.find();
  }

  async getTodoById(id: string): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  async getTodos(
    name?: string,
    description?: string,
    status?: TodoStatusEnum,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ todos: TodoEntity[]; total: number }> {
    // Validate that if name or description is provided, status must also be present
    if (!((name || description) && status)) {
      throw new BadRequestException('Status must be provided if name or description is specified.');
    }

    const query = this.todoRepository.createQueryBuilder('todo');

    // If only status is provided, filter by status
    if (status) {
      query.andWhere('todo.status = :status', { status });
    }

    // If name is provided, filter by name
    if (name) {
      query.andWhere('todo.name LIKE :name', { name: `%${name}%` });
    }

    // If description is provided, filter by description
    if (description) {
      query.andWhere('todo.description LIKE :description', { description: `%${description}%` });
    }

    // Calculate total count of results before pagination
    const total = await query.getCount();

    // Apply pagination
    query.skip((page - 1) * limit).take(limit);

    const todos = await query.getMany();

    // Throw an exception if no Todos are found
    if (todos.length === 0) {
      throw new NotFoundException('No Todo items found for the given criteria.');
    }

    return { todos, total };
  }

  async getAllTodosPaginated(page = 1, limit = 4) {
    const [todos, total] = await this.todoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { page, limit, total, data: todos };
  }
}
