import { Injectable } from '@angular/core';
import { ModalInterface } from '../interface/modal';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  /* Se define como Subject para que se pueda subscribir desde cualquiér componente y para emitir valores con .next() */
  private modalDataSubject = new Subject<ModalInterface>()
  modalData$ = this.modalDataSubject.asObservable()

  showModal(data: ModalInterface) {
    this.modalDataSubject.next(data)
  }
}