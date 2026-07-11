export function randomId(): number{
     return Math.floor(Math.random() * 1_000_000) + 1;
}
export function numeroALetras(num: number): string {
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
    'NUEVE'
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
    'NOVENTA'
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
    'DIECINUEVE'
  ];

  const veinti = [
    'VEINTIUNO',
    'VEINTIDÓS',
    'VEINTITRÉS',
    'VEINTICUATRO',
    'VEINTICINCO',
    'VEINTISÉIS',
    'VEINTISIETE',
    'VEINTIOCHO',
    'VEINTINUEVE'
  ];

  const centenas = [
    '',
    'CIEN',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS'
  ];

  function convertirSeccion(n: number): string {
    let texto = '';

    // Centenas
    if (n >= 100) {
      if (n === 100) return 'CIEN';

      texto += n < 200
        ? 'CIENTO '
        : centenas[Math.floor(n / 100)] + ' ';

      n %= 100;
    }

    // 10
    if (n === 10) return texto + 'DIEZ';

    // 11-19
    if (n >= 11 && n <= 19) {
      return texto + especiales[n - 11];
    }

    // 20
    if (n === 20) return texto + 'VEINTE';

    // 21-29
    if (n >= 21 && n <= 29) {
      return texto + veinti[n - 21];
    }

    // 30-99
    if (n >= 30) {
      texto += decenas[Math.floor(n / 10)];

      if (n % 10 !== 0) {
        texto += ' Y ' + unidades[n % 10];
      }

      return texto;
    }

    // 1-9
    if (n > 0) {
      texto += unidades[n];
    }

    return texto;
  }

  let letras = '';
  let resto = num;

  // Millones
  if (resto >= 1_000_000) {
    const millones = Math.floor(resto / 1_000_000);

    letras += millones === 1
      ? 'UN MILLÓN '
      : `${convertirSeccion(millones)} MILLONES `;

    resto %= 1_000_000;
  }

  // Miles
  if (resto >= 1000) {
    const miles = Math.floor(resto / 1000);

    letras += miles === 1
      ? 'MIL '
      : `${convertirSeccion(miles)} MIL `;

    resto %= 1000;
  }

  // Resto
  if (resto > 0) {
    letras += convertirSeccion(resto);
  }

  return letras.trim();
}
