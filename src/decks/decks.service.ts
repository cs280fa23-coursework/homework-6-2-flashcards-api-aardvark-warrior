import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from './Deck.entity';

@Injectable()
export class DecksService {
    constructor(
        @InjectRepository(Deck)
        private postRepository: Repository<Deck>,
    ) {}

    // We'll add methods for handling CRUD operations here
}
