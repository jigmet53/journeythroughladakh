import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { Public } from '../common/decorators/public.decorator';

/** POST, not GET — matches BRD.md §44's `POST /api/search` API spec. */
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post()
  search(@Body() body: SearchQueryDto) {
    return this.searchService.search(body.q);
  }
}
