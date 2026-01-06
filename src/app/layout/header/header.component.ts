import { Component } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  entidad!: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.entidad = this.router.url.split('/')[1];
      });
  }

  get botones() {
    if (!this.entidad) return [];

    return [
      { nombre: 'lista', ruta: ['/', this.entidad, 'lista'] },
      { nombre: 'crear', ruta: ['/', this.entidad, 'crear'] }
    ];
  }
}
