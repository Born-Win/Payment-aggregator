import {
  Body,
  Controller,
  Post,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthInterceptor } from '../../auth';
import { PartnerService } from '../services';
import { partnersValidationSchema } from '../validation';
import { JoiValidationPipe } from '../../pipes/joi';
import { ConfigurePartnerBodyDto, ConfigurePartnerDto } from '../dto';

@UseInterceptors(AuthInterceptor)
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @UsePipes(new JoiValidationPipe(partnersValidationSchema.config))
  @Post('config')
  setConfig(
    @Body() body: ConfigurePartnerBodyDto,
    @Req() req: { partnerId: string },
  ) {
    this.partnerService.configurePartner(
      new ConfigurePartnerDto(body, req.partnerId),
    );

    return { message: 'Config set successfully' };
  }
}
