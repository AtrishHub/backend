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

import {
  ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery,
} from '@nestjs/swagger';

import { ChatSession } from './entities/chat-session.entity';
import { ChatHistory } from './entities/chat-history.entity';



class RagChatDto {
  question: string;
  sessionId: string;
  documentId: string; // The key differentiator for RAG chat
}

@ApiTags('Chatbot')
@ApiBearerAuth()
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('start-session')
  @ApiOperation({ summary: 'Start a new chat session' })
  @ApiBody({ type: CreateSessionDto })
  @ApiResponse({ status: 201, description: 'Session created successfully.', type: ChatSession })
  @ApiResponse({ status: 400, description: 'Bad Request: teamId is required.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async startSession(@Request() req, @Body() body: CreateSessionDto) {
    const userId = req.user?.sub || 'anonymous';
    if (!body.teamId) throw new BadRequestException('teamId is required');
    return this.chatbotService.startSession(userId, body.title, String(body.teamId));
  }
  
 @UseGuards(AuthGuard('jwt'))
  @Post( )
  @ApiOperation({ summary: 'Send a message to the chatbot (non-streaming)' })
  @ApiBody({ type: MessageDto })
  @ApiResponse({ status: 201, description: 'Receives the complete chatbot response at once.' })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid message or sessionId.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Send a message and receive a streamed response' })
  @ApiBody({ type: MessageDto })
  @ApiResponse({ 
    status: 200, 
    description: 'A server-sent event (SSE) stream. Each "data" event is a JSON object like {"role":"assistant","content":"..."}. The stream ends with an "end" event.',
    headers: { 'Content-Type': { schema: { type: 'string', example: 'text/event-stream; charset=utf-8' } } }
  })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid message or sessionId.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Start a RAG chat stream with a document' })
  @ApiBody({
    description: 'Payload for RAG chat',
    schema: {
      type: 'object',
      required: ['question', 'sessionId', 'documentId'],
      properties: {
        question: {
          type: 'string',
          description: 'The question for the RAG model.',
          example: 'What is mentioned about security in this document?',
        },
        sessionId: {
          type: 'string',
          description: 'The session ID to continue the conversation.',
          example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        },
        documentId: {
          type: 'string',
          description: 'The ID of the document to use for context.',
          example: 'doc-xyz-789',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Returns an SSE stream with event types: 'sources' (initial context), 'token' (response chunks), and 'end'.",
  })
  @ApiResponse({ status: 400, description: 'Bad Request: documentId is required.' })
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
  @ApiOperation({ summary: 'Get all chat sessions for the current user' })
  @ApiResponse({ status: 200, description: "A list of the user's chat sessions.", type: [ChatSession] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSessions(@Request() req) {
    const userId = req.user?.userId || 'anonymous';
    return this.chatbotService.getSessions(userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('messages')
  @ApiOperation({ summary: 'Get all messages for a specific chat session' })
  @ApiQuery({ name: 'sessionId', required: true, type: String, description: 'The ID of the session to retrieve messages for.' })
  @ApiResponse({ status: 200, description: 'A list of messages for the given session.', type: [ChatHistory] })
  @ApiResponse({ status: 400, description: 'Bad Request: sessionId is required.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMessages(@Query('sessionId') sessionId: string, @Request() req) {
    if (!sessionId) throw new BadRequestException('sessionId is required');
    const userId = req.user?.sub || 'anonymous';
    return this.chatbotService.getMessages(sessionId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('history/organized')
  @ApiOperation({ summary: "Get the user's chat history, organized by folders and sessions" })
  @ApiResponse({ status: 200, description: 'Returns an organized structure of the user\'s chat history.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getOrganizedHistory(@Req() req) {
    // Assumes req.user.sub is userId
    return this.chatbotService.getUserChatHistoryOrganized(req.user.sub);
  }
}
