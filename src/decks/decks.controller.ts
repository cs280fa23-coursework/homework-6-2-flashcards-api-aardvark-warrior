import { Delete, Patch, Get, Param, Post, Body, Controller, NotFoundException } from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './create-deck.dto';
import { DeckResponseDto } from './deck-response.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { UpdateDeckDto } from './update-deck.dto';

@Controller('decks')
export class DecksController {
    constructor(private readonly decksService: DecksService) {}

    // Create new Deck
    @Post()
    async create(
        @Body() createDeckDto: CreateDeckDto,
        // @UserId() userId: number,
    ): Promise<DeckResponseDto> {
        const userId = 1; // TODO: get userId from JWT token
        const deck = await this.decksService.create(createDeckDto, userId);
        delete deck.userId;
        return deck;
    }

    // Get a deck by id
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<DeckResponseDto> {
        const deck = await this.decksService.findOne(id);
        if (!deck) {
            throw new NotFoundException(`Deck with ID ${id} not found`);
        }
        delete deck.userId;
        return deck;
    }

    // Update a deck by id
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateDeckDto: UpdateDeckDto,
    ): Promise<DeckResponseDto> {
        const deck = await this.decksService.update(id, updateDeckDto);
        if (!deck) {
            throw new NotFoundException(`Deck with ID ${id} not found`);
        }
        delete deck.userId;
        return deck;
    }

    // Delete a deck by id
    @Delete(':id')
    async remove(
        @Param('id') id: string,
    ): Promise<{ statusCode: number; message: string }> {
        const deck = await this.decksService.remove(id);
        if (!deck) {
            throw new NotFoundException(`Deck with ID ${id} not found`);
        }
        return {
            statusCode: 200,
            message: 'Deck deleted successfully',
        };
    }

    @Get()
    async findAll(): Promise<DeckResponseDto[]> {
        const posts = await this.decksService.findAll();
        return posts.map((post) => {
            delete post.userId;
            return post;
        });
    }


    // We will add handlers for CRUD endpoints here
}

