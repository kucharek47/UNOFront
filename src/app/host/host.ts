import { Component, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Serwer } from '../serwer';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './host.html',
  styleUrl: './host.scss'
})
export class Host {
  serwer = inject(Serwer);
  router = inject(Router);

  nazwa_gracza = '';
  czy_utworzono = false;

  constructor() {
    effect(() => {
      const stan = this.serwer.stan_pokoju();
      if (stan && stan.status === 'w_trakcie') {
        this.router.navigate(['/game']);
      }
    });
  }

  tworz_pokoj() {
    if (this.nazwa_gracza.trim() !== '') {
      this.serwer.tworz_pokoj(this.nazwa_gracza);
      this.czy_utworzono = true;
    }
  }

  dodaj_bota() {
    this.serwer.dodaj_bota();
  }

  start_gry() {
    this.serwer.start_gry();
  }
}
