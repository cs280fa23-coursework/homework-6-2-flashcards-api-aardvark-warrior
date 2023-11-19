import { Delete, Patch, Get, Param, Post, Body, Controller, NotFoundException, Req, ForbiddenException } from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './create-deck.dto';
import { DeckResponseDto } from './deck-response.dto';
import { UpdateDeckDto } from './update-deck.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { DeckOwnershipGuard } from 'src/guards/post-owner.guard';

@UseGuards(JwtAuthGuard, DeckOwnershipGuard)
@Controller('decks')
export class DecksController {
    constructor(private readonly decksService: DecksService) {}

    // Create new Deck
    @Post()
    async create(
        @Body() createDeckDto: CreateDeckDto,
        @UserId() userId: number,               
    ): Promise<DeckResponseDto> {
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
        @UserId() userId: number,
    ): Promise<DeckResponseDto> {
        let deck = await this.decksService.findOne(id);
        
        if (!deck) {
            throw new NotFoundException(`Deck with ID ${id} not found`);
        } else if (deck.userId !== userId) {
            throw new ForbiddenException();
        }

        deck = await this.decksService.update(id, updateDeckDto);
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

