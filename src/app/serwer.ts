import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { pokoj, gracz, karta, aktualizacja_stolu, odpowiedz_serwera } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class Serwer {
  socket: Socket;

  token = signal<string>('');
  kod_pokoju = signal<string>('');
  numer_gracza = signal<number>(-1);

  stan_pokoju = signal<pokoj | null>(null);
  gracze = signal<gracz[]>([]);
  karty = signal<karta[]>([]);
  logi = signal<string[]>([]);

  constructor() {
    this.socket = io('http://localhost:5000');

    this.socket.on('aktualizacja_stolu', (dane: aktualizacja_stolu) => {
      this.aktualizuj_stan(dane);
    });

    this.socket.on('nowy_gracz', (dane: gracz) => {
      this.gracze.update(obecni => [...obecni, dane]);
    });
  }

  aktualizuj_stan(dane: aktualizacja_stolu) {
    if (dane.pokoj) this.stan_pokoju.set(dane.pokoj);
    if (dane.gracze) this.gracze.set(dane.gracze);
    if (dane.karty) this.karty.set(dane.karty);
    if (dane.logi) this.logi.set(dane.logi);
  }

  tworz_pokoj(nazwa: string) {
    this.socket.emit('tworz_pokoj', { nazwa }, (odpowiedz: odpowiedz_serwera) => {
      if (odpowiedz.status === 'ok') {
        this.token.set(odpowiedz.token || '');
        this.kod_pokoju.set(odpowiedz.kod || '');
        this.numer_gracza.set(odpowiedz.numer_gracza ?? -1);
      }
    });
  }

  dolacz(kod: string, nazwa: string) {
    this.socket.emit('dolacz', { kod, nazwa }, (odpowiedz: odpowiedz_serwera) => {
      if (odpowiedz.status === 'ok') {
        this.token.set(odpowiedz.token || '');
        this.kod_pokoju.set(odpowiedz.kod || '');
        this.numer_gracza.set(odpowiedz.numer_gracza ?? -1);
      }
    });
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
      if (odpowiedz.status === 'ok' && odpowiedz.stan_gry) {
        this.aktualizuj_stan(odpowiedz.stan_gry);
      }
    });
  }
}
