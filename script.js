let dados = JSON.parse(localStorage.getItem("financeiro")) || {};
let relatorios = JSON.parse(localStorage.getItem("relatorios")) || {};

function getMesAtual() {
return new Date().toISOString().slice(0,7);
}

function mostrarMes() {
const meses = [
"Janeiro","Fevereiro","Março","Abril","Maio","Junho",
"Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];
const data = new Date();
document.getElementById("mesAtual").innerText =
meses[data.getMonth()] + " " + data.getFullYear();
}

function gerarPDF(mes, dadosMes) {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.text(`Relatório Financeiro - ${mes}`, 20, 20);

let y = 30;

const tipos = [
{nome:"Contas Fixas", chave:"fixo"},
{nome:"Compras", chave:"compras"},
{nome:"Higiene", chave:"higiene"},
{nome:"Entradas", chave:"entrada"}
];

tipos.forEach(tipo => {
doc.text(tipo.nome, 20, y);
y += 6;

let total = 0;

if (dadosMes[tipo.chave]) {
dadosMes[tipo.chave].forEach(item => {
doc.text(`${item.desc} - R$ ${item.valor}`, 25, y);
total += item.valor;
y += 6;
});
}

doc.text(`Total: R$ ${total.toFixed(2)}`, 25, y);
y += 10;
});

doc.save(`Relatorio-${mes}.pdf`);
}

// BOTÃO PDF
function gerarPDFManual() {
const mes = getMesAtual();
if (dados[mes]) {
gerarPDF(mes, dados[mes]);
} else {
alert("Sem dados nesse mês");
}
}

// TROCA DE MÊS
function verificarMudancaMes() {
const mesAtual = getMesAtual();
const mesSalvo = localStorage.getItem("mesAtual");

if (!mesSalvo) {
localStorage.setItem("mesAtual", mesAtual);
return;
}

if (mesSalvo !== mesAtual) {

if (dados[mesSalvo]) {
gerarPDF(mesSalvo, dados[mesSalvo]);
relatorios[mesSalvo] = dados[mesSalvo];
localStorage.setItem("relatorios", JSON.stringify(relatorios));
}

dados[mesAtual] = {
fixo: [],
compras: [],
higiene: [],
entrada: []
};

localStorage.setItem("mesAtual", mesAtual);
salvar();
}
}

function adicionar() {
const desc = document.getElementById("descricao").value;
const tipo = document.getElementById("tipo").value;
const valor = parseFloat(document.getElementById("valor").value);

if (!desc || !valor) return alert("Preencha tudo");

const mes = getMesAtual();

if (!dados[mes]) {
dados[mes] = {fixo:[], compras:[], higiene:[], entrada:[]};
}

dados[mes][tipo].push({desc, valor});

salvar();
carregar();

document.getElementById("descricao").value = "";
document.getElementById("valor").value = "";
}

function carregar() {
const mes = getMesAtual();
const tipos = ["fixo","compras","higiene","entrada"];

tipos.forEach(tipo => {
const ul = document.getElementById(tipo);
ul.innerHTML = "";

let total = 0;

if (dados[mes] && dados[mes][tipo]) {
dados[mes][tipo].forEach((item, i) => {
total += item.valor;

const li = document.createElement("li");
li.innerHTML = `
${item.desc} - R$ ${item.valor}
<button onclick="remover('${tipo}', ${i})">X</button>
`;
ul.appendChild(li);
});
}

document.getElementById(`total-${tipo}`).innerText =
"R$ " + total.toFixed(2);
});
}

function remover(tipo, index) {
const mes = getMesAtual();
dados[mes][tipo].splice(index, 1);
salvar();
carregar();
}

function salvar() {
localStorage.setItem("financeiro", JSON.stringify(dados));
}

mostrarMes();
verificarMudancaMes();
carregar();

setInterval(() => {
mostrarMes();
verificarMudancaMes();
}, 60000);
