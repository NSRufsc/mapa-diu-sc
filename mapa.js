// ===============================
// DADOS (ATUALIZE QUANDO QUISER)
// ===============================
const dadosRegioes = {
  "Chapecó": { enfermeiros: 0, diu: 0, consultas: 0 },
  "Caçador": { enfermeiros: 0, diu: 0, consultas: 0 },
  "Lages": { enfermeiros: 0, diu: 0, consultas: 0 },
  "Joinville": { enfermeiros: 0, diu: 0, consultas: 0 },
  "Blumenau": { enfermeiros: 0, diu: 0, consultas: 0 },
  "Criciúma": { enfermeiros: 0, diu: 0, consultas: 0 },
  "Florianópolis": { enfermeiros: 0, diu: 0, consultas: 0 }
};

// ===============================
// MAPA BASE
// ===============================
const map = L.map("map").setView([-27.3, -50.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// ===============================
// CORES (EXATAMENTE AS SUAS)
// ===============================
function getColor(nome) {
  if (!nome) return "#999";

  if (nome.includes("Chapecó")) return "#f4a261";
  if (nome.includes("Joaçaba")) return "#e9c46a"; // Caçador / Meio-Oeste
  if (nome.includes("Caçador")) return "#b830c7";
  if (nome.includes("Lages")) return "#be3e1e";
  if (nome.includes("Joinville")) return "#f04ca3";
  if (nome.includes("Blumenau")) return "#f6ff4c";
  if (nome.includes("Criciúma") || nome.includes("Tubarão")) return "#4387db";
  if (nome.includes("Florianópolis")) return "#1eda75";

  return "#cccccc";
}

// ===============================
// NOME AMIGÁVEL
// ===============================
function nomeExibicao(nome) {
  if (!nome) return "Região";

  if (nome.includes("Criciúma") || nome.includes("Tubarão"))
    return "Criciúma";

  if (nome.includes("Blumenau"))
    return "Blumenau";

  if (nome.includes("Joaçaba"))
    return "Caçador";

  return nome;
}

// ===============================
// ESTILO
// ===============================
function style(feature) {
  return {
    fillColor: getColor(feature.properties.NM_RGINT),
    weight: 2,
    color: "#333",
    fillOpacity: 0.85
  };
}

// ===============================
// TOOLTIP
// ===============================
function textoTooltip(regiao) {
  const d = dadosRegioes[regiao] || { enfermeiros: 0, diu: 0, consultas: 0 };

  return `
    <strong>${regiao}</strong><br>
     Enfermeiros capacitados: <b>${d.enfermeiros}</b><br>
     DIU de Cobre inseridos: <b>${d.diu}</b><br>
     Consultas realizadas: <b>${d.consultas}</b>
  `;
}

// ===============================
// INTERAÇÃO
// ===============================
function onEachFeature(feature, layer) {
  const nomeOriginal = feature.properties.NM_RGINT;
  const regiao = nomeExibicao(nomeOriginal);

  layer.bindTooltip(textoTooltip(regiao), {
    sticky: true,
    direction: "center",
    className: "tooltip-regiao"
  });

  layer.on({
    mouseover: e => {
      e.target.setStyle({
        weight: 3,
        fillOpacity: 1
      });
      e.target.bringToFront();
    },
    mouseout: e => geojson.resetStyle(e.target)
  });
}

let geojson;

// ===============================
// CARREGAR GEOJSON
// ===============================
fetch("./sc-regioes-intermediarias.geojson")
  .then(res => res.json())
  .then(data => {
    geojson = L.geoJSON(data, {
      style,
      onEachFeature
    }).addTo(map);
  });
