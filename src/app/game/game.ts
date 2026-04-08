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
  animacja_bledu = false;
  timer_bledu: any;
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

  czy_ruch_legalny(k: karta): boolean {
    const stan = this.serwer.stan_pokoju();
    const stos = this.karta_na_stosie();
    if (!stan) return false;

    if (stan.aktywne_combo) {
      return k.wartosc === stan.aktywne_combo || (['+2', '+4'].includes(stan.aktywne_combo) && ['+2', '+4'].includes(k.wartosc));
    }
    if (stan.kara > 0) return k.wartosc === '+2' || k.wartosc === '+4';
    if (stan.ile_stopow > 0) return k.wartosc === 'stop';

    if (!k.kolor) return true;
    if (k.kolor === stan.aktualny_kolor) return true;
    if (stos && stos.wartosc === k.wartosc) return true;
    return false;
  }

  pobierz_akcje_dla_karty(k: karta): number {
    const kolory = ['czerwony', 'zielony', 'niebieski', 'zolty'];
    const wartosci = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'stop', 'zmiana_kierunku', '+2'];

    if (k.kolor) {
      return kolory.indexOf(k.kolor) * 13 + wartosci.indexOf(k.wartosc);
    }
    return -1;
  }

  kliknij_karte(k: karta) {
    if (!this.czy_ruch_legalny(k)) {
      this.animacja_bledu = false;

      if (this.timer_bledu) {
        clearTimeout(this.timer_bledu);
      }

      setTimeout(() => {
        this.animacja_bledu = true;
      }, 10);

      this.timer_bledu = setTimeout(() => {
        this.animacja_bledu = false;
      }, 610);

      return;
    }

    if (k.wartosc === 'zmiana_koloru' || k.wartosc === '+4') {
      this.czy_wybiera_kolor = true;
      this.wybrana_karta = k;
    } else {
      const akcja = this.pobierz_akcje_dla_karty(k);
      if (akcja !== -1) {
        this.wyslij_akcje(akcja);
      }
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
  zakoncz_ture() {
    this.wyslij_akcje(62);
  }
}
