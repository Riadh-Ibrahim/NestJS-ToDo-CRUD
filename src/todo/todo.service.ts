import { Injectable, Inject , NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo';
import { TodoStatusEnum } from './todo-status.enum';
import { AddTodoDto } from './dto/addtodo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { TodoEntity } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchTodoDto } from './dto/searchtodo.dto';
import constants from '../constants';
import { Like } from 'typeorm';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    @Inject(constants.uuid) private generateUUID: () => string,
  ) {}

  getAllTodos(): Todo[] {
    return this.todos;
  }

  async getAllTodosV2() {
    return await this.todoRepository.find();
  }

  async getAllTodosPaginated(page = 1, limit = 4) {
    let todos, total;
    [todos, total] = await this.todoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      page,
      limit,
      total,
      data: todos,
    };
  }

  async getTodoById(id: string) {
    const todo = await this.todoRepository.findOne({where:{id: String(id)}});
    if (todo) return todo;
    throw new NotFoundException(`Todo with id ${id} not found`);
  }

  addTodo(newTodo: AddTodoDto): Todo {
    const { name, description } = newTodo;
    const id = this.generateUUID();
    const todo = {
      id,
      name,
      description,
      createdAt: new Date(),
      status: TodoStatusEnum.waiting,
    };
    this.todos.push(todo);
    return todo;
  }

  async addTodoV2(newTodo: AddTodoDto) {
    const todo = this.todoRepository.create(newTodo);
    return await this.todoRepository.save(todo);
  }

  deleteTodoById(id: string) {
    const todo = this.getTodoById(id);
    if (todo) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    }
    return {
      message: `Todo with id ${id} has been deleted`,
      count: 1,
    };
  }

  async softDeleteTodoById(id: string) {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return await this.todoRepository.softDelete(id);
  }

  async restoreTodoById(id: string) {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return await this.todoRepository.restore(id);
  }

  updateTodoById(id: string, newTodo: Partial<UpdateTodoDto>) {
    const todo = this.getTodoById(id);
    todo.description = newTodo.description ?? todo.description;
    todo.name = newTodo.name ?? todo.name;
    todo.status = newTodo.status ?? todo.status;
    return todo;
  }

  async updateTodoByIdV2(id: string, newTodo: Partial<UpdateTodoDto>) {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return await this.todoRepository.update(id, newTodo);
  }

  async getTodoStatusCount() {
    const active = await this.todoRepository.count({ where: { status: TodoStatusEnum.actif } });
    const waiting = await this.todoRepository.count({ where: { status: TodoStatusEnum.waiting } });
    const done = await this.todoRepository.count({ where: { status: TodoStatusEnum.done } });
    return { active, waiting, done };
  }

  async countTodoByStatus(status: TodoStatusEnum) {
    return await this.todoRepository.count({ where: { status } });
  }

  async searchTodo(param: SearchTodoDto) {
    let whereClause = {};
    if (param.status) {
      whereClause = { ...whereClause, status: param.status };
    }
    if (param.criteria) {
      whereClause = {
        ...whereClause,
        name: Like(`%${param.criteria}%`),
        description: Like(`%${param.criteria}%`),
      };
    }
    return await this.todoRepository.find({ where: whereClause });
  }
}