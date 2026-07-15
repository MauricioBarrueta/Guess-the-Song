import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Modal } from "./shared/modal/modal";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Modal, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('guess-the-song');
  
  bgClass = 'bg-[var(--dusty-grape)]'

  /* Actualiza el color de fondo de la aplicación según la ruta activa */
  constructor(private router: Router) {
    
    /* Escucha únicamente cuando finaliza una navegación */
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url

        if (url.startsWith('/main')) {
          this.bgClass = 'bg-gradient-to-t from-[var(--dusty-grape)] from-25% to-[var(--dusk-blue)] to-65%'          
        } else if (
          url.startsWith('/quiz') ||
          url.startsWith('/game-score')
        ) {
          // this.bgClass = 'bg-[var(--dusk-blue)]'
          this.bgClass = 'bg-gradient-to-t from-[var(--dusk-blue)] from-25% to-[var(--dusty-grape)] to-65%'
        }
      });
  }
}