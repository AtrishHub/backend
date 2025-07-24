
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ enum: ['user', 'assistant'], example: 'how are you?' })
  messages: { role: 'user' | 'assistant'; content: string }[];

  @ApiProperty({
    description: 'The session id of the message.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  sessionId: string;
}