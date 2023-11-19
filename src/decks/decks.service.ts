import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from './deck.entity';
import { CreateDeckDto } from './create-deck.dto';
import { UpdateDeckDto } from './update-deck.dto';

@Injectable()
export class DecksService {
    constructor(
        @InjectRepository(Deck)
        private deckRepository: Repository<Deck>,
    ) {}

    // Create a new Deck
    async create(createDeckDto: CreateDeckDto, userId: number): Promise<Deck> {
        const deck = await this.deckRepository.create({
            ...createDeckDto,
            userId,
        });
        return this.deckRepository.save(deck);
    }

    // Find and return a Deck
    async findOne(id: string): Promise<Deck | null> {
        return this.deckRepository.findOneBy({ id });
    }

    // Update a Deck
    async update(id: string, updateDeckDto: UpdateDeckDto): Promise<Deck | null> {
        const deck = await this.deckRepository.preload({ id, ...updateDeckDto });
        if (!deck) {
            return null;
        }
        return this.deckRepository.save(deck);
    }
      
      
      

    // We'll add methods for handling CRUD operations here
}
