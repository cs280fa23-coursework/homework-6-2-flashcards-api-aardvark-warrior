import { Delete, Patch, Get, Param, Post, Body, Controller, NotFoundException, Req, ForbiddenException, Query } from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './create-deck.dto';
import { DeckResponseDto } from './deck-response.dto';
import { UpdateDeckDto } from './update-deck.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { DeckOwnershipGuard } from 'src/guards/deck-owner.guard';
import { UserService } from 'src/user/user.service';

type DeckResponseWithPagination = {
    filter?: string;
    search?: string;
    data: DeckResponseDto[];
    pagination: {
        limit: number;
        offset: number;
    };
};
  
@UseGuards(JwtAuthGuard)
@Controller('decks')
export class DecksController {
    constructor(
        private readonly decksService: DecksService,
        private readonly userService: UserService
    ) {}

    @Get()
    async findAll(
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0,
        @Query('search') search: string,
        @Query('username') username?: string,
    ): Promise<DeckResponseWithPagination> {
        let userId: number | undefined;

        if (username) {
            const user = await this.userService.findOne(username);
            if (!user) {
                throw new NotFoundException(`User with username ${username} not found`);
            }
            userId = user.id;
        }

        const decks = await this.decksService.findAll(
            limit,
            offset,
            search,
            userId,
        );

        return {
            filter: username,
            search,
            pagination: {
                limit,
                offset,
            },
            data: decks.map((deck) => {
                delete deck.userId;
                return deck;
            }),
        };
    }

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
    @UseGuards(DeckOwnershipGuard)
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
    @UseGuards(DeckOwnershipGuard)
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
    @UseGuards(DeckOwnershipGuard)
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

    // We will add handlers for CRUD endpoints here
}

