const BASE_URL = "https://TU_API_BASE_URL"; // ←--- MISMA U OTRA URL

// ✅ Fix TS: convertir uri → Blob y usar filename como 3er parámetro
async function uriToBlob(uri: string): Promise<Blob> {
  const res = await fetch(uri);
  return await res.blob();
}

export async function uploadDniImages({
  token,
  frente,
  dorso,
}: {
  token: string;
  frente: { uri: string; mime?: string };
  dorso: { uri: string; mime?: string };
}) {
  const form = new FormData();

  const frenteBlob = await uriToBlob(frente.uri);
  const dorsoBlob = await uriToBlob(dorso.uri);

  // En DOM types: append(name, blob, filename)
  form.append("frente", frenteBlob, "dni_frente.jpg");
  form.append("dorso", dorsoBlob, "dni_dorso.jpg");

  const res = await fetch(`${BASE_URL}/dni/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ⚠️ No seteés manualmente Content-Type; fetch arma el boundary
    },
    body: form,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Upload failed: ${res.status} ${msg}`);
  }
  return res.json();
}
