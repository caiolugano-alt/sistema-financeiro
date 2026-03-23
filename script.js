let dados = JSON.parse(localStorage.getItem("dados")) || {
fixas: [],
compras: [],
higiene: [],
entradas: []
};

function salvar() {
localStorage.setItem("dados", JSON.stringify(dados));
}

function add() {
const desc = document.getElementById("desc").value;
const valor = parseFloat(document.getElementById("valor").value);
const tipo = document.getElementById("tipo").value;

if (!desc || isNaN(valor)) {
alert("Preencha corretamente!");
return;
}

dados[tipo].push({
desc,
valor,
pago: false
});

salvar();
render();

document.getElementById("desc").value = "";
document.getElementById("valor").value = "";
}

function render() {
["fixas", "compras", "higiene", "entradas"].forEach(tipo => {
const tabela = document.getElementById(tipo);
if (!tabela) return;

tabela.innerHTML = "";
let total = 0;

dados[tipo].forEach((item, i) => {
total += item.valor;

tabela.innerHTML += `
<tr>
<td>${item.desc}</td>
<td>R$ ${item.valor}</td>
<td>
${tipo !== "higiene" && tipo !== "entradas"
? `<button onclick="toggle('${tipo}', ${i})">
${item.pago ? "PAGO" : "PENDENTE"}
</button>`
: ""}
</td>
<td>
<button onclick="remover('${tipo}', ${i})">🗑️</button>
</td>
</tr>
`;
});

if (tipo === "fixas") {
document.getElementById("totalFixas").innerText = "R$ " + total;
}

if (tipo === "compras") {
document.getElementById("totalCompras").innerText = "R$ " + total;
}

if (tipo === "entradas") {
document.getElementById("totalEntradas").innerText = "R$ " + total;
}
});
}

function toggle(tipo, i) {
dados[tipo][i].pago = !dados[tipo][i].pago;
salvar();
render();
}

function remover(tipo, i) {
if (confirm("Deseja apagar?")) {
dados[tipo].splice(i, 1);
salvar();
render();
}
}

render();
