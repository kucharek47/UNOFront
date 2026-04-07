import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss'
})
export class Lobby {
  router = inject(Router);

  idz_do_host() {
    this.router.navigate(['/host']);
  }

  idz_do_join() {
    this.router.navigate(['/join']);
  }
}
