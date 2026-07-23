import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from './service/modal-service';
import { ModalInterface } from './interface/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [ CommonModule ],
  templateUrl: './modal.html',
})
export class Modal implements OnInit, OnDestroy {

  constructor(private modalService: ModalService, private cdr: ChangeDetectorRef) {}  
  
  mouseEnter: boolean = false
  isVisible: boolean = false

  /* Control de la cuenta regresiva y el cierre automático del modal */
  countdown = 0
  private countdownInterval?: ReturnType<typeof setInterval>;
  private autoCloseTimeout?: ReturnType<typeof setTimeout>;
  
  /* Se inicializa la interface para evitar errores por 'undefined' */
  modalData: ModalInterface = {
    title: '',
    content: '',
    onConfirm: () => {},
    onCancel: () => {},
  }

  ngOnInit() {
    /* Se reciben los valores desde el componente donde fue llamado el Modal y se activa el temporizador */
    this.modalService.modalData$.subscribe(data => {
      this.modalData = data
      this.isVisible = true 
      
      if (data.autoCloseMs) {
        this.startCountdown(data.autoCloseMs)
      }
    })
  }

  ngOnDestroy(): void {
    this.clearTimers()
  }

  /* Inicia la cuenta regresiva y programa el cierre automático del modal */
  private startCountdown(ms: number): void {
    this.clearTimers()

    this.countdown = Math.ceil(ms / 1000)

    /* Se actualiza la cuenta regresiva cada segundo */    
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;

        /* Fuerza la detección de cambios para actualizar la vista tras el setInterval */
        this.cdr.detectChanges();
      }
    }, 1000);

    /* Programa el cierre automático del modal */
    this.autoCloseTimeout = setTimeout(() => {
      this.closeModal();
    }, ms);
  }

  /* Cancela los temporizadores activos del modal, evitando reutilizar referencias antiguas asignando 'undefined' */
  private clearTimers(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
      this.countdownInterval = undefined
    }

    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout)
      this.autoCloseTimeout = undefined
    }
  }

  /* Cierra el modal y restablece los temporizadores */
  private closeModal(): void {
    this.clearTimers()
    this.countdown = 0

    this.isVisible = false
    /* Fuerza la actualización de la variable isVisible */
    this.cdr.detectChanges()
  }
  
  /* Acciones de los botones del Modal */
  confirm() {
    this.modalData.onConfirm()
    this.closeModal()
  }

  cancel() {
    this.modalData.onCancel?.()
    this.closeModal()
  }
}