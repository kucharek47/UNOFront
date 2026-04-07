import { Component, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Serwer } from '../serwer';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './join.html',
  styleUrl: './join.scss'
})
export class Join {
  serwer = inject(Serwer);
  router = inject(Router);

  nazwa_gracza = '';
  kod_pokoju = '';
  czy_dolaczono = false;

  constructor() {
    effect(() => {
      const stan = this.serwer.stan_pokoju();
      if (stan && stan.status === 'w_trakcie') {
        this.router.navigate(['/game']);
      }
    });
  }

  dolacz_do_pokoju() {
    if (this.nazwa_gracza.trim() !== '' && this.kod_pokoju.trim() !== '') {
      this.serwer.dolacz(this.kod_pokoju, this.nazwa_gracza);
      this.czy_dolaczono = true;
    }
  }

  wroc_do_menu() {
    this.router.navigate(['/lobby']);
  }
}
