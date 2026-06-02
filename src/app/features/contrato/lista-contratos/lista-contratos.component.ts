import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IContrato, ContractStatus } from '../contrato.interface';

@Component({
  selector: 'app-lista-contratos',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './lista-contratos.component.html',
  styleUrl: './lista-contratos.component.scss'
})
export class ListaContratosComponent {
  evento = output<void>();
  filtroSeleccionado: ContractStatus | 'todos' = 'todos';
  contratosBD = signal<IContrato[]>([
    {
      id: 1,
      inquilinoId: 1,
      inmuebleId: 1,
      propietarioId: 1,
      fechaInicio: new Date('2024-01-15'),
      fechaFin: new Date('2025-01-14'),
      estado: 'activo',
      rentaMensual: 450000,
      titulo: 'Depto. Monoambiente - Palermo'
    },
    {
      id: 2,
      inquilinoId: 2,
      inmuebleId: 2,
      propietarioId: 1,
      fechaInicio: new Date('2023-06-01'),
      fechaFin: new Date('2024-05-31'),
      estado: 'finalizado',
      rentaMensual: 380000,
      titulo: 'Local Comercial - Florida'
    },
    {
      id: 3,
      inquilinoId: 3,
      inmuebleId: 3,
      propietarioId: 2,
      fechaInicio: new Date('2024-03-01'),
      fechaFin: new Date('2026-02-28'),
      estado: 'activo',
      rentaMensual: 720000,
      titulo: 'Casa 3 amb. - San Isidro'
    },
    {
      id: 4,
      inquilinoId: 4,
      inmuebleId: 1,
      propietarioId: 3,
      fechaInicio: new Date('2024-07-01'),
      fechaFin: new Date('2025-06-30'),
      estado: 'preliminar',
      rentaMensual: 520000,
      titulo: 'Depto. 2 amb. - Recoleta'
    },
    {
      id: 5,
      inquilinoId: 5,
      inmuebleId: 4,
      propietarioId: 2,
      fechaInicio: new Date('2022-09-15'),
      fechaFin: new Date('2024-09-14'),
      estado: 'finalizado',
      rentaMensual: 290000,
      titulo: 'Cochera Techada - Caballito'
    },
    {
      id: 6,
      inquilinoId: 1,
      inmuebleId: 2,
      propietarioId: 4,
      fechaInicio: new Date('2025-01-15'),
      fechaFin: new Date('2026-01-14'),
      estado: 'renovar',
      rentaMensual: 410000,
      titulo: 'Depto. 1 amb. - Villa Urquiza'
    },
    {
      id: 7,
      inquilinoId: 6,
      inmuebleId: 3,
      propietarioId: 1,
      fechaInicio: new Date('2024-10-01'),
      fechaFin: new Date('2025-09-30'),
      estado: 'cancelado',
      rentaMensual: 650000,
      titulo: 'Oficina - Microcentro'
    },
    {
      id: 8,
      inquilinoId: 2,
      inmuebleId: 5,
      propietarioId: 3,
      fechaInicio: new Date('2025-02-01'),
      fechaFin: new Date('2027-01-31'),
      estado: 'activo',
      rentaMensual: 890000,
      titulo: 'PH 4 amb. - Belgrano'
    }
  ]);
  contratos = signal<IContrato[]>([...this.contratosBD()]);

  contratoSeleccionado = signal<IContrato | null>(null);
  eventoSidenav() {
      this.evento.emit();
  }
  seleccionarContrato(contrato: IContrato) {
    this.contratoSeleccionado.set(contrato);
  }

  getEstadoColor(estado: ContractStatus): string {
    const colores: Record<ContractStatus, string> = {
      preliminar: 'preliminar',
      activo: 'activo',
      finalizado: 'finalizado',
      cancelado: 'cancelado',
      renovar: 'renovar'
    };
    return colores[estado];
  }

  getEstadoLabel(estado: ContractStatus): string {
    const labels: Record<ContractStatus, string> = {
      preliminar: 'Preliminar',
      activo: 'Activo',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
      renovar: 'Renovar'
    };
    return labels[estado];
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  formatearFecha(fecha: Date): string {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(fecha);
  }

  //filtrar listado de contratos
  filtrarContratos() {
    this.contratos.update(contratos => {
      if (this.filtroSeleccionado === 'todos'){
        return this.contratosBD();
      }else{
        return this.contratosBD().filter(contrato =>
          contrato.titulo?.toLowerCase().includes(this.filtroSeleccionado.toLowerCase()) ||
          this.getEstadoLabel(contrato.estado).toLowerCase().includes(this.filtroSeleccionado.toLowerCase())
        );
      };
     
    });
  }
}
