import { Controller, HttpStatus, Post, HttpCode, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { newTodo, updateTodo } from './dto';

@Controller('todos')
export class TodosController {
  constructor(private transactionService: TodosService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  add(@Body() params: newTodo) {
    return this.transactionService.add(params);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() params: updateTodo) {
    return this.transactionService.update(id, params);
  }
}
