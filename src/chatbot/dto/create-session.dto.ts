
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({
    description: 'The ID of the user starting the session. This is typically handled by the auth guard.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  userId: string;
  @ApiProperty({
    description: 'An optional title for the chat session.',
    example: 'My First Chat',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'The ID of the team associated with this session.',
    example: '47910454-619d-4bd6-b31a-1b4dd1e2598c',
  })
  teamId: string;
}