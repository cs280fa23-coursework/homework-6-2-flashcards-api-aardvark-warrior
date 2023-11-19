export class DeckResponseDto {
  id: string;
  title: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  numberOfCards: number;
}
