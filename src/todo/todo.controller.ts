import { Controller, Post, Get, Body, Delete, Patch, Param, Version, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo';
import { AddTodoDto } from './dto/addtodo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { TodoStatusEnum } from './todo-status.enum';
import { TodoEntity } from './entities/todo.entity';

@Controller('todo')
export class TodoController {
    constructor(private todoService: TodoService) {}
    @Post()
    @Version('1')
    addTodo(
        @Body() newTodo: AddTodoDto,
    ): Todo {
        return <Todo>this.todoService.addTodo(newTodo);
    }

    @Post('/v2')
    @Version('2')
    async addTodoV2(
        @Body() newTodo: AddTodoDto
    ) {
        return await this.todoService.addTodoV2(newTodo);
    }

    @Patch(':id')
    updateTodoByID(
        @Param('id') id : string,
        @Body() newTodo: Partial<UpdateTodoDto>
    ) {
        return this.todoService.updateTodoById(id, newTodo);
    }
    
    @Patch('/v2/:id')
    @Version('2')
    async updateTodoByIDV2(
        @Param('id') id : string,
        @Body() newTodo: Partial<UpdateTodoDto>
    ) {
        return await this.todoService.updateTodoByIdV2(id, newTodo);
    }

    @Delete(':id')
    deleteTodoByID(
    @Param('id') id : string,
    ) {
    return this.todoService.deleteTodoById(id);
    }
    
    @Delete('/v2/:id')
    @Version('2')
    async softDeleteTodo(
        @Param('id') id : string
    ) {
        return await this.todoService.softDeleteTodoById(id);
    }

    @Get('restore/:id')
    async restoreTodo(
        @Param('id') id : string
    ) {
        return await this.todoService.restoreTodoById(id);
    }

    @Get('/countall')
    async countTodo() {
        return await this.todoService.getTodoStatusCount();
    }

    @Get("/all")
    getAllTodos() {
        return this.todoService.getAllTodosV2();
    }

    @Get(':id')
    getTodoById(@Param('id') id: string) {
        return this.todoService.getTodoById(id);
    }

    @Get()
    async getTodos(
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('status') status?: TodoStatusEnum,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    ): Promise<{ todos: TodoEntity[]; total: number }> {
    return this.todoService.getTodos(name, description, status, page, limit);
    }


    @Get('/all/paginated')
    async getAllTodosPaginated(
        @Query('page') page = 1,
        @Query('limit') limit = 4
    ) {
        return await this.todoService.getAllTodosPaginated(page, limit);
    }
}