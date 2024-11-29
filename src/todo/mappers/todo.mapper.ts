import { TodoEntity } from '../entities/todo.entity';
import { AddTodoDto } from '../dto/addtodo.dto';
import { SearchTodoDto } from '../dto/searchtodo.dto';
import { UpdateTodoDto } from '../dto/updatetodo.dto';
import { TodoStatusEnum } from '../todo-status.enum';

export function mapTodoToDto(todo: TodoEntity): AddTodoDto {
    const addTodoDto = new AddTodoDto();
    addTodoDto.name = todo.name;
    addTodoDto.description = todo.description;
    return addTodoDto;
  }

export function mapAddTodoDtoToEntity(addTodoDto: AddTodoDto): TodoEntity {
  const todo = new TodoEntity();
  todo.name = addTodoDto.name;
  todo.description = addTodoDto.description;
  todo.status = TodoStatusEnum.active;
  todo.CreatedAt = new Date();
  return todo;
}

export function mapSearchTodoDtoToQuery(searchTodoDto: SearchTodoDto): any {
    const query: any = {};
    if (searchTodoDto.criteria) {
      query.name = { $regex: searchTodoDto.criteria, $options: 'i' };
    }
    if (searchTodoDto.status) {
      query.status = searchTodoDto.status;
    }
    return query;
  }
  
export function mapUpdateTodoDtoToEntity(updateTodoDto: UpdateTodoDto, todo: TodoEntity): TodoEntity {
    todo.name = updateTodoDto.name || todo.name;
    todo.description = updateTodoDto.description || todo.description;
    todo.status = updateTodoDto.status || todo.status;
    return todo;
  }