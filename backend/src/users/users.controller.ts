import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // This sets the URL path to http://localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Handles POST requests to add users
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get() // Handles GET requests to list users
  findAll() {
    return this.usersService.findAll();
  }
}