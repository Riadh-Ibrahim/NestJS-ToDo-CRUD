import { Controller, Post, Get, Body, Delete, Patch, Param, Version, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo';
import { AddTodoDto } from './dto/addtodo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { SearchTodoDto } from './dto/searchtodo.dto';

@Controller('todo')
export class TodoController {
    constructor(private todoService: TodoService) {}

    @Get('/search')
    async searchTodo(
        @Query() param: SearchTodoDto
    ) {
        return await this.todoService.searchTodo(param);
    }

    @Get("/all")
    getAllTodos() {
        return this.todoService.getAllTodosV2();
    }

    // Get all todos with pagination
    @Get('/all/paginated')
    async getAllTodosPaginated(
        @Query('page') page = 1,
        @Query('limit') limit = 4
    ) {
        return await this.todoService.getAllTodosPaginated(page, limit);
    }

    @Post()
    @Version('1')
    addTodo(
        @Body() newTodo: AddTodoDto,
    ): Todo {
        return <Todo>this.todoService.addTodo(newTodo);
    }

    // Add todo
    @Post('/v2')
    @Version('2')
    async addTodoV2(
        @Body() newTodo: AddTodoDto
    ) {
        return await this.todoService.addTodoV2(newTodo);
    }

    @Get(':id')
    getTodoById(@Param('id') id: string) {
        return this.todoService.getTodoById(id);
    }

    @Delete(':id')
    deleteTodoByID(
      @Param('id') id : string,
    ) {
      return this.todoService.deleteTodoById(id);
    }
    
    // Soft delete todo
    @Delete('/v2/:id')
    @Version('2')
    async softDeleteTodo(
        @Param('id') id : string
    ) {
        return await this.todoService.softDeleteTodoById(id);
    }


    //restore
    @Get('restore/:id')
    async restoreTodo(
        @Param('id') id : string
    ) {
        return await this.todoService.restoreTodoById(id);
    }

    //updateTodoByID
    @Patch(':id')
    updateTodoByID(
        @Param('id') id : string,
        @Body() newTodo: Partial<UpdateTodoDto>
    ) {
        return this.todoService.updateTodoById(id, newTodo);
    }
    
    // Update todo
    @Patch('/v2/:id')
    @Version('2')
    async updateTodoByIDV2(
        @Param('id') id : string,
        @Body() newTodo: Partial<UpdateTodoDto>
    ) {
        return await this.todoService.updateTodoByIdV2(id, newTodo);
    }

    @Get('/countall')
    async countTodo() {
        return await this.todoService.getTodoStatusCount();
    }
}