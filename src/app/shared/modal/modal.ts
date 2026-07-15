import { Component, OnInit } from '@angular/core';
import { ModalService } from './service/modal-service';
import { ModalInterface } from './interface/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [ CommonModule ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal implements OnInit {

  constructor(private modalService: ModalService) {}
  
  mouseEnter: boolean = false
  isVisible: boolean = false

  // remainingSec!: number
  
  /* Se inicializa la interface para evitar errores por 'undefined' */
  modalData: ModalInterface = {
    title: '',
    content: '',
    onConfirm: () => {},
    onCancel: () => {},
  }

  ngOnInit() {
    /* Se reciben los valores desde el componente donde fue llamado el Modal */
    this.modalService.modalData$.subscribe(data => {
      this.modalData = data
      this.isVisible = true      
    })
  }

  /* Se asignan las acciones de los botones del Modal */
  confirm() {
    this.modalData.onConfirm()
    this.isVisible = false
  }

  cancel() {
    this.modalData.onCancel?.()
    this.isVisible = false
  }
}