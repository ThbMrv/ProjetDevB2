import { Get, UseGuards, Controller } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from 'express';
import { AdminService } from "./admin.service";
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';


@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('utilisateurs')
  findAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('projets')
  findAllProjects() {
    return this.adminService.getAllProjects();
  }
}
