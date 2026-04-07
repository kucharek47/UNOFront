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
    if (this.wybrana_karta && k) {
      const kolory = ['czerwony', 'zielony', 'niebieski', 'zolty'];
      const kolor_idx = kolory.indexOf(k);
      const baza_akcji = this.wybrana_karta.wartosc === 'zmiana_koloru' ? 52 : 56;
      this.wyslij_akcje(baza_akcji + kolor_idx);
      this.wybrana_karta = null;
    }
  }

  zglos_brak_uno(gracz_id: number) {
    const cel = this.serwer.gracze().find(g => g.id === gracz_id);
    if (cel) {
      const ile_graczy = this.serwer.gracze().length;
      const odleglosc = (cel.numer_w_pokoju - this.serwer.numer_gracza() + ile_graczy) % ile_graczy;
      this.wyslij_akcje(63 + odleglosc);
    }
  }

  dobierz_karte() {
    this.wyslij_akcje(60);
  }

  krzycz_uno() {
    this.wyslij_akcje(61);
  }


  wyslij_akcje(akcja_id: number) {
    this.serwer.wykonaj_ruch(akcja_id);
  }

  wroc_do_lobby() {
    this.router.navigate(['/lobby']);
  }
}
