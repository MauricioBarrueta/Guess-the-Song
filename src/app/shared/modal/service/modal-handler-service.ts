import { Injectable } from '@angular/core';
import { ModalService } from './modal-service';

@Injectable({
  providedIn: 'root',
})
export class ModalHandlerService {

  constructor(private modalService: ModalService) {}

  infoModal(title: string, content: string) {
    this.modalService.showModal({
      title: title,
      content: content,
      type: 'info',
      confirmText: 'Continuar',
      autoCloseMs: 10000,
      onConfirm: () => {},
    })
  }

  confirmModal(icon: string, title: string, content: string, onConfirm: () => void) {
    this.modalService.showModal({
      icon: icon,
      title: title,
      content: content,
      type: 'confirm',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm,

    })
  } 

  resultModal(icon: string, title: string, content: string, type: 'warning' | 'error', onConfirm: () => void) {
    this.modalService.showModal({
      icon: icon,
      title: title,
      content: content,
      type,
      confirmText: 'Volver al inicio',
      onConfirm,
    })
  }
}