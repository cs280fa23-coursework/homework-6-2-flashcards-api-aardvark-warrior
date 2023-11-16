import { Controller } from '@nestjs/common';
import { DecksService } from './decks.service';

@Controller('decks')
export class DecksController {
    constructor(private readonly decksService: DecksService) {}

    // We will add handlers for CRUD endpoints here
}
