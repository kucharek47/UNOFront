export type kolor = 'czerwony' | 'zielony' | 'niebieski' | 'zolty' | null;

export type wartosc_karty =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'stop' | 'zmiana_kierunku' | '+2' | 'zmiana_koloru' | '+4';

export type lokalizacja_karty = 'stos' | 'talia' | 'reka';

export type status_pokoju = 'oczekuje' | 'w_trakcie' | 'zakonczona';

export interface karta {
  id: number;
  gracz_id: number | null;
  lokalizacja: lokalizacja_karty;
  pozycja: number;
  kolor: kolor;
  wartosc: wartosc_karty;
}

export interface gracz {
  id: number;
  numer_w_pokoju: number;
  nazwa: string;
  czy_bot: boolean;
  zglasza_uno: boolean;
  pominiete_tury: number;
}

export interface pokoj {
  id: number;
  kod_dostepu: string;
  status: status_pokoju;
  aktualny_gracz: number;
  kierunek: number;
  aktualny_kolor: kolor;
  kara: number;
  ile_stopow: number;
  aktywne_combo: string | null;
}

export interface aktualizacja_stolu {
  pokoj: pokoj;
  gracze: gracz[];
  karty: karta[];
  logi: string[];
}

export interface odpowiedz_serwera {
  status: 'ok' | 'blad';
  wiadomosc?: string;
  kod?: string;
  token?: string;
  numer_gracza?: number;
  stan_gry?: aktualizacja_stolu;
}
