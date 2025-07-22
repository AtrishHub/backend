import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Request,
  BadRequestException,
  UseGuards,
  Res,
  Req,
  Sse,
  MessageEvent
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { MessageDto } from './dto/message.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as readline from 'readline';
import { Observable } from 'rxjs';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

class RagChatDto {
  question: string;
  sessionId: string;
  documentId: string; // The key differentiator for RAG chat
}

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('start-session')
  async startSession(@Request() req, @Body() body: CreateSessionDto) {
    const userId = req.user?.sub || 'anonymous';
    if (!body.teamId) throw new BadRequestException('teamId is required');
    return this.chatbotService.startSession(userId, body.title, String(body.teamId));
  }
  
 @UseGuards(AuthGuard('jwt'))
  @Post( )
  async chatbot(@Body() dto: MessageDto, @Request() req) {
    const userMessage = dto.messages?.find((m) => m.role === 'user');
    if (!userMessage || !dto.sessionId)
      throw new BadRequestException('Invalid message or sessionId');
    const userId = req.user?.userId || 'anonymous';
    const response = await this.chatbotService.chatStream(
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
  @Post('stream')
  async streamChat(@Body() dto: MessageDto, @Request() req, @Res() res: Response) {
    const userMessage = dto.messages?.find((m) => m.role === 'user');
    if (!userMessage || !dto.sessionId)
      throw new BadRequestException('Invalid message or sessionId');
    const userId = req.user?.sub || 'anonymous';
     
    const stream = await this.chatbotService.chatStream(
      userId,
      dto.sessionId,
      userMessage.content,
    );
    if (!stream) {
      res.status(500).send('Failed to connect to chat stream');
      return;
    }
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const rl = readline.createInterface({ input: stream });
    let responseEnded = false;
    const safeWrite = (data: string) => {
      if (!responseEnded) {
        res.write(data);
      }
    };
    const safeEnd = () => {
      if (!responseEnded) {
        responseEnded = true;
        res.end();
      }
    };
    rl.on('line', (line) => {
      try {
        const data = JSON.parse(line);
        if (typeof data.response === 'string') {
          safeWrite(`data: ${JSON.stringify({ role: 'assistant', content: data.response })}\n\n`);
        }
        if (data.done) {
          rl.close();
          safeWrite('event: end\ndata: [DONE]\n\n');
        }
      } catch (e) {
      
      }
    });
    rl.on('close', () => {
      safeEnd();
    });
    rl.on('error', () => {
      safeEnd();
    });
  }

  @Post('rag-stream')
  @Sse()
  async ragStream(
    @Body() body: RagChatDto,
    @Request() req,
  ): Promise<Observable<MessageEvent>> {
    const { question, sessionId, documentId } = body;
    const userId = req.user.sub;

    if (!documentId) {
      throw new BadRequestException('documentId is required for RAG chat.');
    }

    const stream = await this.chatbotService.chatWithDocument(
      userId,
      documentId,
      sessionId,
      question,
    );

    return new Observable((observer) => {
      (async () => {
        let firstChunk = true;
        for await (const chunk of stream) {
          if (chunk.context && firstChunk) {
            // Event 1: Send the source documents
            observer.next({
              type: 'sources',
              data: chunk.context.map((doc: any) => ({
                pageContent: doc.pageContent,
                filename: doc.metadata.originalFilename,
                pageNumber: doc.metadata.loc?.pageNumber,
              })),
            });
            firstChunk = false;
          }
          if (chunk.answer) {
            // Event 2: Stream the answer tokens
            observer.next({ type: 'token', data: chunk.answer });
          }
        }
        // Event 3: Signal the end of the stream
        observer.next({ type: 'end', data: 'Stream finished.' });
        observer.complete();
      })();
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sessions')
 
  async getSessions(@Request() req) {
    const userId = req.user?.userId || 'anonymous';
    return this.chatbotService.getSessions(userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('messages')
  async getMessages(@Query('sessionId') sessionId: string, @Request() req) {
    if (!sessionId) throw new BadRequestException('sessionId is required');
    const userId = req.user?.sub || 'anonymous';
    return this.chatbotService.getMessages(sessionId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('history/organized')
  async getOrganizedHistory(@Req() req) {
    // Assumes req.user.sub is userId
    return this.chatbotService.getUserChatHistoryOrganized(req.user.sub);
  }
}
