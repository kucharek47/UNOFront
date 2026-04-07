import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

const straznik_dostepu: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const czy_przegladarka = typeof window !== 'undefined';
  const token = czy_przegladarka ? sessionStorage.getItem('token') : null;

  if (token) {
    return true;
  }

  return router.parseUrl('/lobby');
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'lobby',
    pathMatch: 'full'
  },
  {
    path: 'lobby',
    loadComponent: () => import('./lobby/lobby').then(m => m.Lobby)
  },
  {
    path: 'join',
    loadComponent: () => import('./join/join').then(m => m.Join)
  },
  {
    path: 'host',
    loadComponent: () => import('./host/host').then(m => m.Host)
  },
  {
    path: 'game',
    loadComponent: () => import('./game/game').then(m => m.Game),
    canActivate: [straznik_dostepu]
  },
  {
    path: '**',
    redirectTo: 'lobby'
  }
];
