import { Get, Param, Post, Body, Controller, NotFoundException } from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './create-deck.dto';
import { DeckResponseDto } from './deck-response.dto';

@Controller('decks')
export class DecksController {
    constructor(private readonly decksService: DecksService) {}

    @Post()
    async create(@Body() createDeckDto: CreateDeckDto): Promise<DeckResponseDto> {
        const userId = 1; // TODO: get userId from JWT token
        const deck = await this.decksService.create(createDeckDto, userId);
        delete deck.userId;
        return deck;
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<DeckResponseDto> {
        const deck = await this.decksService.findOne(id);
        if (!deck) {
            throw new NotFoundException(`Deck with ID ${id} not found`);
        }
        delete deck.userId;
        return deck;
    }


    // We will add handlers for CRUD endpoints here
}

