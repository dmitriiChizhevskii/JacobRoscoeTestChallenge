import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class newTodo {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  task: string;
}

export class updateTodo {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;
}