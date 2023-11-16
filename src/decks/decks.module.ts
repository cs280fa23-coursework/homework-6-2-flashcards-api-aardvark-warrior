import { Module } from '@nestjs/common';
import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from './deck.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Deck])],
  controllers: [DecksController],
  providers: [DecksService]
})
export class DecksModule {}
