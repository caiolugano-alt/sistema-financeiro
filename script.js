import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
getDatabase,
ref,
push,
onValue,
remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔥 SUA CONFIG
const firebaseConfig = {
apiKey: "AIzaSyA0Ybp19oNnssftNduxr-Hy8lz-U2T6BOc",
authDomain: "controle-financeiro-370c8.firebaseapp.com",
databaseURL: "https://controle-financeiro-370c8-default-rtdb.firebaseio.com",
projectId: "controle-financeiro-370c8",
storageBucket: "controle-financeiro-370c8.appspot.com",
messagingSenderId: "203673077768",
appId: "1:203673077768:web:48ae75991c21a6f702e9bd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ELEMENTOS
const lista = document.getElementById("lista");
const saldoEl = document.getElementById("saldo");
const mesSelect = document.getElementById("mes");

// MESES
const meses = [
"Janeiro","Fevereiro","Março","Abril","Maio","Junho",
"Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

meses.forEach((m, i) => {
const op = document.createElement("option");
op.value = i;
op.text = m;
mesSelect.appendChild(op);
});

mesSelect.value = new Date().getMonth();

// REFERÊNCIA
const dbRef = ref(db, "movimentacoes");

// ➕ ADICIONAR
window.adicionar = function () {
const descricao = document.getElementById("descricao").value;
const valor = Number(document.getElementById("valor").value);
const tipo = document.getElementById("tipo").value;
const mes = mesSelect.value;

if (!descricao || !valor) return alert("Preencha tudo");

push(dbRef, {
descricao,
valor,
tipo,
mes
});
};

// ❌ REMOVER
window.remover = function (id) {
remove(ref(db, "movimentacoes/" + id));
};

// 🔄 CARREGAR
onValue(dbRef, (snapshot) => {
lista.innerHTML = "";

let saldo = 0;
let entrada = 0;
let saida = 0;

const mesAtual = mesSelect.value;

snapshot.forEach((child) => {
const item = child.val();
const id = child.key;

if (item.mes != mesAtual) return;

if (item.tipo === "entrada") {
saldo += item.valor;
entrada += item.valor;
} else {
saldo -= item.valor;
saida += item.valor;
}

lista.innerHTML += `
<div>
${item.descricao} - R$ ${item.valor}
<span class="delete" onclick="remover('${id}')">❌</span>
</div>
`;
});

saldoEl.innerText = saldo;

// gráfico
if (window.chart) window.chart.destroy();

const ctx = document.getElementById("grafico");

window.chart = new Chart(ctx, {
type: "pie",
data: {
labels: ["Entradas", "Saídas"],
datasets: [{
data: [entrada, saida]
}]
}
});
});

// troca de mês
mesSelect.addEventListener("change", () => {
location.reload();
});
