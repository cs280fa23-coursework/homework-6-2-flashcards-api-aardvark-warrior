import { Module } from '@nestjs/common';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- add this line
import { Deck } from './deck.entity'; // <-- add this line

@Module({
    imports: [TypeOrmModule.forFeature([Deck])],
    providers: [DecksService],
    controllers: [DecksController]
})
export class DecksModule {}
