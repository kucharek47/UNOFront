import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Serwer } from '../serwer';
import { karta, kolor } from '../interfaces';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {
  serwer = inject(Serwer);
  router = inject(Router);

  czy_wybiera_kolor = false;
  wybrana_karta: karta | null = null;

  moje_id = computed(() => {
    const ja = this.serwer.gracze().find(g => g.numer_w_pokoju === this.serwer.numer_gracza());
    return ja ? ja.id : -1;
  });

  moja_reka = computed(() => {
    return this.serwer.karty().filter(k => k.lokalizacja === 'reka' && k.gracz_id === this.moje_id());
  });

  karta_na_stosie = computed(() => {
    const stos = this.serwer.karty().filter(k => k.lokalizacja === 'stos');
    return stos.length > 0 ? stos[stos.length - 1] : null;
  });

  przeciwnicy = computed(() => {
    return this.serwer.gracze().filter(g => g.id !== this.moje_id());
  });

  kliknij_karte(k: karta) {
    if (k.wartosc === 'zmiana_koloru' || k.wartosc === '+4') {
      this.czy_wybiera_kolor = true;
      this.wybrana_karta = k;
    } else {
      this.wyslij_akcje(k.pozycja);
    }
  }

  wybierz_kolor(k: kolor) {
    this.czy_wybiera_kolor = false;
    if (this.wybrana_karta) {
      this.wyslij_akcje(this.wybrana_karta.pozycja);
      this.wybrana_karta = null;
    }
  }

  dobierz_karte() {
    const max_pozycja = this.moja_reka().length;
    this.wyslij_akcje(max_pozycja);
  }

  krzycz_uno() {

  }

  zglos_brak_uno(gracz_id: number) {

  }

  wyslij_akcje(akcja_id: number) {
    this.serwer.wykonaj_ruch(akcja_id);
  }

  wroc_do_lobby() {
    this.router.navigate(['/lobby']);
  }
}
