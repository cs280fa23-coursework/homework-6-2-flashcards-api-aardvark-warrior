import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from './deck.entity';
import { CreateDeckDto } from './create-deck.dto';

@Injectable()
export class DecksService {
    constructor(
        @InjectRepository(Deck)
        private deckRepository: Repository<Deck>,
    ) {}

    async create(createDeckDto: CreateDeckDto, userId: number): Promise<Deck> {
        const deck = await this.deckRepository.create({
            ...createDeckDto,
            userId,
        });
        return this.deckRepository.save(deck);
    }
      

    // We'll add methods for handling CRUD operations here
}
