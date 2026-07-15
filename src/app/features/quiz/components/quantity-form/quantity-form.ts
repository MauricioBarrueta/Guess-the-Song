import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quantity-form',
  imports: [ FormsModule ],
  templateUrl: './quantity-form.html',
  styleUrl: './quantity-form.scss',
})
export class QuantityForm {

  @Input({ required: true }) quantity!: number
  @Output() quantityChange = new EventEmitter<number>()

  /* Controla la cantidad ingresada, impidiendo que sea mayor al límite */
  updateQty(value: number) {
    const qty = Math.max(5, Math.min(25, value))
    this.quantity = qty

    /* Emite la nueva cantidad al componente padre */
    this.quantityChange.emit(qty)
  }

  /* Verifica si se presionaron las teclas (+ -) o (↑ ↓) para incrementar/decrementar la cantidad sin presionar los botones */
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case '+':
      case 'ArrowUp':
        event.preventDefault()
        this.updateQty(this.quantity + 5)
        break

      case '-':
      case 'ArrowDown':
        event.preventDefault()
        this.updateQty(this.quantity - 5)
        break
    }
  }
}
