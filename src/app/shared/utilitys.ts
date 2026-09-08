export function randomId(): number {
  return Math.floor(Math.random() * 1_000_000) + 1;
}
export function numeroALetras(valor: number | string): string {
  const num = Number(valor); // Asegurarse de que sea un número
  if (isNaN(num)) {
    throw new Error('El valor proporcionado no es un número válido');
  }

  if (num === 0) return 'CERO';

  const unidades = [
    '',
    'UNO',
    'DOS',
    'TRES',
    'CUATRO',
    'CINCO',
    'SEIS',
    'SIETE',
    'OCHO',
    'NUEVE',
  ];

  const especiales = [
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISÉIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE',
  ];

  const decenas = [
    '',
    'DIEZ',
    'VEINTE',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA',
  ];

  const veintis = [
    'VEINTIUNO',
    'VEINTIDÓS',
    'VEINTITRÉS',
    'VEINTICUATRO',
    'VEINTICINCO',
    'VEINTISÉIS',
    'VEINTISIETE',
    'VEINTIOCHO',
    'VEINTINUEVE',
  ];

  const centenas = [
    '',
    'CIENTO',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS',
  ];

  function convertirSeccion(n: number): string {
    if (n === 0) return '';
    if (n === 100) return 'CIEN';

    let texto = '';

    // Centenas
    if (n > 100) {
      texto += centenas[Math.floor(n / 100)] + ' ';
      n %= 100;
    }

    // 1-9
    if (n < 10) {
      return (texto + unidades[n]).trim();
    }

    // 10
    if (n === 10) {
      return (texto + 'DIEZ').trim();
    }

    // 11-19
    if (n >= 11 && n <= 19) {
      return (texto + especiales[n - 11]).trim();
    }

    // 20
    if (n === 20) {
      return (texto + 'VEINTE').trim();
    }

    // 21-29
    if (n >= 21 && n <= 29) {
      return (texto + veintis[n - 21]).trim();
    }

    // 30-99
    const decena = Math.floor(n / 10);
    const unidad = n % 10;

    texto += decenas[decena];

    if (unidad > 0) {
      texto += ' Y ' + unidades[unidad];
    }

    return texto.trim();
  }

  let resultado = '';

  const millones = Math.floor(num / 1_000_000);
  const miles = Math.floor((num % 1_000_000) / 1000);
  const resto = num % 1000;

  // Millones
  if (millones > 0) {
    resultado +=
      millones === 1 ? 'UN MILLÓN ' : `${convertirSeccion(millones)} MILLONES `;
  }

  // Miles
  if (miles > 0) {
    resultado += miles === 1 ? 'MIL ' : `${convertirSeccion(miles)} MIL `;
  }

  // Resto
  if (resto > 0) {
    resultado += convertirSeccion(resto);
  }

  return resultado.trim().replace(/\s+/g, ' ');
}
