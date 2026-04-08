import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { pokoj, gracz, karta, aktualizacja_stolu, odpowiedz_serwera } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class Serwer {
  socket: Socket;

  token = signal<string>(typeof window !== 'undefined' ? sessionStorage.getItem('token') || '' : '');
  kod_pokoju = signal<string>(typeof window !== 'undefined' ? sessionStorage.getItem('kod_pokoju') || '' : '');
  numer_gracza = signal<number>(typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('numer_gracza') || '-1', 10) : -1);

  stan_pokoju = signal<pokoj | null>(null);
  gracze = signal<gracz[]>([]);
  karty = signal<karta[]>([]);
  logi = signal<string[]>([]);

  constructor() {
    this.socket = io('https://uno.kucharek47.pl/');

    this.socket.on('connect', () => {
      if (this.token()) {
        this.wznow_sesje();
      }
    });

    this.socket.on('aktualizacja_stolu', (dane: aktualizacja_stolu) => {
      this.aktualizuj_stan(dane);
    });

    this.socket.on('nowy_gracz', (dane: any) => {
      const nowy_gracz: gracz = {
        id: -1,
        numer_w_pokoju: dane.numer,
        nazwa: dane.nazwa || `Bot ${dane.numer}`,
        czy_bot: dane.czy_bot,
        zglasza_uno: false,
        pominiete_tury: 0
      };
      this.gracze.update(obecni => [...obecni, nowy_gracz]);
    });

    if (this.token()) {
      this.wznow_sesje();
    }
  }

  aktualizuj_stan(dane: aktualizacja_stolu) {
    console.log('[DEBUG] Otrzymano stan stolu:', dane);

    if (dane.pokoj) this.stan_pokoju.set(dane.pokoj);
    if (dane.gracze) this.gracze.set(dane.gracze);
    if (dane.karty) this.karty.set(dane.karty);

    if (dane.logi && dane.logi.length > 0) {
      this.logi.update(obecne => [...obecne, ...dane.logi!]);
    }
  }

  tworz_pokoj(nazwa: string) {
    this.socket.emit('tworz_pokoj', { nazwa }, (odpowiedz: odpowiedz_serwera) => {
      if (odpowiedz.status === 'ok') {
        this.zapisz_sesje(odpowiedz.token!, odpowiedz.kod!, odpowiedz.numer_gracza!);
        this.gracze.set([{
          id: -1,
          numer_w_pokoju: odpowiedz.numer_gracza!,
          nazwa: nazwa,
          czy_bot: false,
          zglasza_uno: false,
          pominiete_tury: 0
        }]);
      } else {
        alert(odpowiedz.wiadomosc);
      }
    });
  }

  dolacz(kod: string, nazwa: string) {
    this.socket.emit('dolacz', { kod, nazwa }, (odpowiedz: odpowiedz_serwera) => {
      if (odpowiedz.status === 'ok') {
        this.zapisz_sesje(odpowiedz.token!, odpowiedz.kod!, odpowiedz.numer_gracza!);
      } else {
        alert(odpowiedz.wiadomosc);
      }
    });
  }

  private zapisz_sesje(token: string, kod: string, numer: number) {
    this.token.set(token);
    this.kod_pokoju.set(kod);
    this.numer_gracza.set(numer);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('kod_pokoju', kod);
      sessionStorage.setItem('numer_gracza', numer.toString());
    }
  }

  dodaj_bota() {
    this.socket.emit('dodaj_bota', { token: this.token() });
  }

  start_gry() {
    this.socket.emit('start_gry', { token: this.token() });
  }

  wykonaj_ruch(akcja: number) {
    this.socket.emit('wykonaj_ruch', { token: this.token(), akcja });
  }

  wznow_sesje() {
    this.socket.emit('wznow_sesje', { token: this.token() }, (odpowiedz: odpowiedz_serwera) => {
      if (odpowiedz.status === 'ok') {
        if (odpowiedz.numer_gracza !== undefined) {
          this.numer_gracza.set(odpowiedz.numer_gracza);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('numer_gracza', odpowiedz.numer_gracza.toString());
          }
        }
        if (odpowiedz.stan_gry) {
          this.aktualizuj_stan(odpowiedz.stan_gry);
        }
      }
    });
  }
}
