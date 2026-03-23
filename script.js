let dados = {
fixas: [],
gastos: [],
compras: [],
entradas: []
};

function entrar() {
if (user.value === "admin" && pass.value === "1234") {
login.style.display = "none";
sistema.style.display = "block";
carregar();
mostrar("fixas");
atualizarTela();
}
}

function mostrar(secao) {
document.querySelectorAll(".secao").forEach(d => d.style.display = "none");
document.getElementById(secao).style.display = "block";
}

function salvar() {
localStorage.setItem("dados", JSON.stringify(dados));
}

function carregar() {
const d = localStorage.getItem("dados");
if (d) dados = JSON.parse(d);
}

function adicionar(tipo, nomeId, valorId) {
const nome = document.getElementById(nomeId).value;
const valor = parseFloat(document.getElementById(valorId).value);

if (!nome || !valor) return;

dados[tipo].push({ nome, valor });

salvar();
atualizarTela();
}

function atualizarTela() {
atualizarLista("listaFixas", dados.fixas, "fixas");
atualizarLista("listaGastos", dados.gastos, "gastos");
atualizarLista("listaCompras", dados.compras, "compras");
atualizarLista("listaEntradas", dados.entradas, "entradas");
}

function atualizarLista(id, lista, tipo) {
const tbody = document.getElementById(id);
if (!tbody) return;

tbody.innerHTML = "";

lista.forEach((item, i) => {
tbody.innerHTML += `
<tr>
<td>${item.nome}</td>
<td>R$ ${item.valor.toFixed(2)}</td>
<td><button onclick="remover('${tipo}',${i})">Excluir</button></td>
</tr>
`;
});
}

function remover(tipo, i) {
dados[tipo].splice(i, 1);
salvar();
atualizarTela();
}

function gerarRelatorio() {
mostrar("relatorio");

let total = 0;

for (let tipo in dados) {
total += dados[tipo].reduce((s, i) => s + i.valor, 0);
}

relatorio.innerHTML = `<h2>Total: R$ ${total.toFixed(2)}</h2>`;
}
