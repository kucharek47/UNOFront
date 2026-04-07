import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  imports: [],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby {
  constructor(private router: Router) {}

  przejdz_do_host(): void {
    this.router.navigate(['/host']);
  }

  przejdz_do_join(): void {
    this.router.navigate(['/join']);
  }
}
