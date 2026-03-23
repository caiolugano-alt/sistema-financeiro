let dados = {
fixas: [],
gastos: [],
entradas: []
};

let grafico;

function mostrar(secao) {
const conteudo = document.getElementById("conteudo");
conteudo.innerHTML = "";

if (secao === "fixas") {
conteudo.innerHTML = `
<h2>Contas Fixas</h2>
<input id="nome" placeholder="Nome">
<input id="valor" placeholder="Valor">
<button onclick="adicionar('fixas')">Adicionar</button>
<div id="lista"></div>
`;
}

if (secao === "gastos") {
conteudo.innerHTML = `
<h2>Gastos</h2>
<input id="nome" placeholder="Nome">
<input id="valor" placeholder="Valor">
<button onclick="adicionar('gastos')">Adicionar</button>
<div id="lista"></div>
`;
}

if (secao === "entradas") {
conteudo.innerHTML = `
<h2>Entradas</h2>
<input id="nome" placeholder="Nome">
<input id="valor" placeholder="Valor">
<button onclick="adicionar('entradas')">Adicionar</button>
<div id="lista"></div>
`;
}

if (secao === "relatorio") {
gerarGrafico();
}

atualizarLista(secao);
}

function adicionar(tipo) {
const nome = document.getElementById("nome").value;
const valor = parseFloat(document.getElementById("valor").value);

if (!nome || isNaN(valor)) return;

dados[tipo].push({ nome, valor });
salvarDados();
mostrar(tipo);
}

function atualizarLista(tipo) {
const lista = document.getElementById("lista");
if (!lista) return;

lista.innerHTML = "";

dados[tipo].forEach(item => {
lista.innerHTML += `<p>${item.nome} - R$ ${item.valor}</p>`;
});
}

function gerarGrafico() {
const ctx = document.getElementById("grafico");

const totalEntradas = dados.entradas.reduce((a, b) => a + b.valor, 0);
const totalGastos = dados.gastos.reduce((a, b) => a + b.valor, 0);
const totalFixas = dados.fixas.reduce((a, b) => a + b.valor, 0);

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

function salvarDados() {
localStorage.setItem("dados", JSON.stringify(dados));
}

function carregarDados() {
const salvo = localStorage.getItem("dados");
if (salvo) {
dados = JSON.parse(salvo);
}
}

carregarDados();
mostrar("fixas");
