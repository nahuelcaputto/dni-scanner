export type DniParsed = {
  dni?: string;
  apellido?: string;
  nombres?: string;
  sexo?: "M" | "F" | "X" | string;
  fechaNacimiento?: string; // YYYY-MM-DD
  fechaEmision?: string; // YYYY-MM-DD
  fechaVencimiento?: string; // YYYY-MM-DD
  tramite?: string;
  raw?: string; // ⚠️ no loguear en prod
};

export const toISO = (yyyymmdd?: string) =>
  yyyymmdd && /^\d{8}$/.test(yyyymmdd)
    ? `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
    : undefined;

export const parseDniPdf417 = (raw: string): DniParsed => {
  const clean = raw.replace(/\s+/g, " ").trim();
  const parts = clean
    .split("@")
    .map((s) => s.trim())
    .filter(Boolean);

  const mayus = parts.filter((p) => /^[A-ZÁÉÍÓÚÜÑ\s]+$/.test(p));
  const nums8 = [...clean.matchAll(/\b(\d{8})\b/g)].map((m) => m[1]);

  // DNI (7–9 dígitos, quitar ceros a la izquierda; evitar fechas)
  const dniCands = [...clean.matchAll(/\b0*\d{7,9}\b/g)].map((m) => m[0]);
  const dni =
    dniCands
      .find((n) => n.length >= 7 && n.length <= 9 && !nums8.includes(n))
      ?.replace(/^0+/, "") ||
    dniCands.find((n) => n.length >= 7 && n.length <= 9)?.replace(/^0+/, "");

  const sexoMatch =
    clean.match(/\b(SEXO|SEX)\s*[:\-]?\s*([MFX])\b/i) ||
    parts.map((p) => p.match(/^(M|F|X)$/)).find(Boolean) ||
    null;
  const sexo = sexoMatch
    ? ((sexoMatch[2] || sexoMatch[0]) as string).toUpperCase()
    : undefined;

  const fechaNacimiento = toISO(
    (clean.match(/NAC\D*(\d{8})/i) ||
      clean.match(/NACI\D*(\d{8})/i) ||
      [])[1] || nums8[0]
  );
  const fechaEmision = toISO(
    (clean.match(/EMI(SI[ÓO]N)?\D*(\d{8})/i) || [])[2] || nums8[1]
  );
  const fechaVencimiento = toISO(
    (clean.match(/VENC\D*(\d{8})/i) || [])[1] || nums8[2]
  );
  const tramite = (clean.match(/TR[ÁA]MITE\D*(\d+)/i) || [])[1];

  const apellido = mayus[0];
  const nombres = mayus[1];

  return {
    dni,
    apellido,
    nombres,
    sexo,
    fechaNacimiento,
    fechaEmision,
    fechaVencimiento,
    tramite,
    raw,
  };
};

export const yyyymmddToDate = (iso?: string) =>
  iso ? new Date(iso + "T00:00:00Z") : undefined;

export const validateParsed = (p: DniParsed) => {
  const errors: string[] = [];

  // DNI 7–8 dígitos
  if (!p.dni || !/^\d{7,8}$/.test(p.dni)) {
    errors.push("DNI inválido (se esperan 7–8 dígitos).");
  }

  // Fechas plausibles
  const born = yyyymmddToDate(p.fechaNacimiento);
  const emis = yyyymmddToDate(p.fechaEmision);
  const venc = yyyymmddToDate(p.fechaVencimiento);
  const today = new Date();

  if (born) {
    const age = Math.floor((+today - +born) / (365.25 * 24 * 3600 * 1000));
    if (age < 0 || age > 120)
      errors.push("Fecha de nacimiento fuera de rango plausible.");
  } else {
    errors.push("Fecha de nacimiento ausente o inválida.");
  }

  if (!emis) errors.push("Fecha de emisión ausente o inválida.");
  if (!venc) errors.push("Fecha de vencimiento ausente o inválida.");

  if (emis && venc && emis >= venc)
    errors.push("Emisión debe ser anterior a Vencimiento.");
  if (venc && venc <= today) errors.push("Documento vencido.");

  return errors;
};
