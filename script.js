let grafico;

// LOGIN
function logar() {
const user = document.getElementById("usuario").value;
const pass = document.getElementById("senha").value;

if (user === "admin" && pass === "1234") {
document.getElementById("login").style.display = "none";
document.getElementById("sistema").style.display = "block";

localStorage.setItem("logado", "true");

carregarDados();
mostrar("fixas");
} else {
alert("Usuário ou senha incorretos");
}
}

// manter logado
window.onload = function() {
if (localStorage.getItem("logado") === "true") {
document.getElementById("login").style.display = "none";
document.getElementById("sistema").style.display = "block";

carregarDados();
mostrar("fixas");
}
}

function getMes() {
return document.getElementById("mes").value;
}

function mostrar(secao) {
document.querySelectorAll(".secao").forEach(div => div.style.display = "none");
document.getElementById(secao).style.display = "block";

if (secao === "relatorio") atualizarGrafico();
}

function adicionar(tipo, nomeId, valorId) {
const nome = document.getElementById(nomeId).value;
const valor = parseFloat(document.getElementById(valorId).value);

if (!nome || !valor) return alert("Preencha tudo");

let mes = getMes();
let dados = JSON.parse(localStorage.getItem(mes)) || {
fixas: [],
gastos: [],
entradas: []
};

dados[tipo].push({ nome, valor });

localStorage.setItem(mes, JSON.stringify(dados));

document.getElementById(nomeId).value = "";
document.getElementById(valorId).value = "";

carregarDados();
}

function carregarDados() {
let mes = getMes();
let dados = JSON.parse(localStorage.getItem(mes)) || {
fixas: [],
gastos: [],
entradas: []
};

["fixas", "gastos", "entradas"].forEach(tipo => {
let lista = document.getElementById("lista-" + tipo);
lista.innerHTML = "";

dados[tipo].forEach((item, i) => {
let li = document.createElement("li");
li.innerHTML = `
${item.nome} - R$ ${item.valor.toFixed(2)}
<button onclick="remover('${tipo}', ${i})">❌</button>
`;
lista.appendChild(li);
});
});

atualizarResumo(dados);
}

function remover(tipo, index) {
let mes = getMes();
let dados = JSON.parse(localStorage.getItem(mes));

dados[tipo].splice(index, 1);

localStorage.setItem(mes, JSON.stringify(dados));

carregarDados();
}

function atualizarResumo(dados) {
let entradas = dados.entradas.reduce((a,b)=>a+b.valor,0);
let gastos = dados.gastos.reduce((a,b)=>a+b.valor,0);
let fixas = dados.fixas.reduce((a,b)=>a+b.valor,0);

let saldo = entradas - (gastos + fixas);

document.getElementById("total").innerText =
`Saldo: R$ ${saldo.toFixed(2)}`;
}

function atualizarGrafico() {
let mes = getMes();
let dados = JSON.parse(localStorage.getItem(mes)) || {
fixas: [],
gastos: [],
entradas: []
};

let totalFixas = dados.fixas.reduce((a,b)=>a+b.valor,0);
let totalGastos = dados.gastos.reduce((a,b)=>a+b.valor,0);
let totalEntradas = dados.entradas.reduce((a,b)=>a+b.valor,0);

const ctx = document.getElementById("grafico");

if (grafico) grafico.destroy();

grafico = new Chart(ctx, {
type: "pie",
data: {
labels: ["Entradas", "Gastos", "Fixas"],
datasets: [{
data: [totalEntradas, totalGastos, totalFixas],
backgroundColor: ["green", "red", "orange"]
}]
}
});
}
