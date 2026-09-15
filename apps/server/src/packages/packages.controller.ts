import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

// RolesGuard is registered globally (see AppModule) — @Roles() alone is enough.
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public()
  @Get()
  findAll() {
    return this.packagesService.findAll();
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.packagesService.findBySlug(slug);
  }

  @Roles(Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  create(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto);
  }

  @Roles(Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}
