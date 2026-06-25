import { Component, input, OnInit } from '@angular/core';
import { Garante } from '../../garantes/garante-interface';
import { TitleCasePipe } from '@angular/common';
import { IInquilino } from '../inquilino.interface';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-ver-info-garante',
  standalone: true,
  imports: [TitleCasePipe, MatDividerModule],
  templateUrl: './ver-info-garante.component.html',
  styleUrl: './ver-info-garante.component.scss'
})
export class VerInfoGaranteComponent{
  inquilino = input<IInquilino | undefined>(undefined)
  get garantes(): Garante[] {
    return this.inquilino()?.garantes ?? []
  }

}
