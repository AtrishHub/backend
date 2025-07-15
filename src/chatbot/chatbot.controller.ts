// src/chatbot/chatbot.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Request,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { MessageDto } from './dto/message.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('start-session')
  async startSession(@Request() req, @Body() body: CreateSessionDto) {
    const userId = req.user?.userId || 'anonymous';
    return this.chatbotService.startSession(userId, body.title);
  }
  
 @UseGuards(AuthGuard('jwt'))
  @Post( )
  async chatbot(@Body() dto: MessageDto, @Request() req) {
    const userMessage = dto.messages?.find((m) => m.role === 'user');
    if (!userMessage || !dto.sessionId)
      throw new BadRequestException('Invalid message or sessionId');
    const userId = req.user?.userId || 'anonymous';
    const response = await this.chatbotService.chat(
      userId,
      dto.sessionId,
      userMessage.content,
    );
    return {
      role: 'assistant',
      content: response,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sessions')
 
  async getSessions(@Request() req) {
    const userId = req.user?.userId || 'anonymous';
    return this.chatbotService.getSessions(userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('messages')
  async getMessages(@Query('sessionId') sessionId: string) {
    if (!sessionId) throw new BadRequestException('sessionId is required');
    return this.chatbotService.getMessages(sessionId);
  }
}
