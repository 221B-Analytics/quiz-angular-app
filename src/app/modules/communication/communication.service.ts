import { Injectable } from '@angular/core';

import { HttpService } from 'src/app/core/services';

import { Communication } from 'src/app/modules/communication/communication.model';
import { URLConstants } from 'src/app/core/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(
    private httpService: HttpService
  ) { }

  getCommunications(mentorId: number, senderId: number) {
    return this.httpService.get(URLConstants.GET_COMMUNICATIONS_API + `/${mentorId}/${senderId}`);
  }

  // userId can be provider/mentor or seeker
  getUnseenCommunications(userId: number) {
    return this.httpService.get(URLConstants.GET_UNSEEN_COMMUNICATIONS_API + `/${userId}`);
  }
  
  createCommunication(payload: Communication) {
    return this.httpService.post(URLConstants.CREATE_COMMUNICATION_API, payload);
  }

  markCommunicationsAsSeen(payload: Communication) {
    return this.httpService.put(URLConstants.MARK_COMMUNICATIONS_AS_SEEN_API, payload);
  }
}
