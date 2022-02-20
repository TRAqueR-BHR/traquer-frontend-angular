import { Injectable } from '@angular/core';
import {MessageService} from 'primeng/api';
import { TranslationService } from 'src/app/module/translation/service/translation.service';

@Injectable({
  providedIn: 'root'
})
export class UINotificationService {

  constructor(private messageService:MessageService,
              private translationService:TranslationService) { }
  
  public notifySuccess(detail:string, 
                       summary = this.translationService.getTranslation("i18n@@success")){


    this.messageService.add({severity:'success', 
                             summary: summary, 
                             detail: detail});
  }

  public notifyInfo(detail:string, 
                    summary = this.translationService.getTranslation("i18n@@info")){
    
    this.messageService.add({severity:'info', 
                             summary: summary, 
                             detail: detail});
  }

  public notifyWarn(detail:string, 
                    summary = this.translationService.getTranslation("i18n@@warn")){

    this.messageService.add({severity:'warn', 
                             summary: summary, 
                             detail: detail});
  }
  
}
