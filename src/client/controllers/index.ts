import {
  Body,
  Controller,
  Post,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthInterceptor } from '../../auth';
import { ClientService } from '../services';
import { JoiValidationPipe } from '../../pipes/joi';
import { clientsValidationSchema } from '../validation';
import { CreateClientBodyDto, CreateClientDto } from '../dto';

@Controller('clients')
@UseInterceptors(AuthInterceptor)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UsePipes(new JoiValidationPipe(clientsValidationSchema.create))
  @Post()
  setConfig(
    @Body() body: CreateClientBodyDto,
    @Req() req: { partnerId: string },
  ) {
    const clientId = this.clientService.addClient(
      new CreateClientDto(body, req.partnerId),
    );

    return {
      id: clientId,
      message: 'Client created successfully',
    };
  }
}
