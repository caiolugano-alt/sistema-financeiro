// 🔥 CONFIG FIREBASE (SEU)
const firebaseConfig = {
apiKey: "AIzaSyA0Ybb190nNssftNduxr-Hy8lz-U2T6B0c",
authDomain: "controle-financeiro-370c8.firebaseapp.com",
projectId: "controle-financeiro-370c8",
storageBucket: "controle-financeiro-370c8.appspot.com",
messagingSenderId: "203673077768",
appId: "1:203673077768:web:48ae75991c21a6f702e9bd"
};

// 🔥 INICIAR FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 📅 MÊS AUTOMÁTICO
function pegarMesAtual() {
const hoje = new Date();
const meses =  [
    "janeiro", "fevereiro", "março", "abril",
    "maio",  "junho",  "julho",  "agosto",
    "setembro",  "outubro", "novembro", "dezembro"

]

const mes = meses[hoje.getMonth()];
const ano = hoje.getFullYear();

return mes + " de " +  ano;
}

document.getElementById("mesAtual").innerText = pegarMesAtual();

// 🧠 VARIÁVEIS
let saldo = 0;

// ➕ ADICIONAR
async function adicionar() {
const descricao = document.getElementById("descricao").value;
const valor = parseFloat(document.getElementById("valor").value);
const tipo = document.getElementById("tipo").value;
const mes = pegarMesAtual();

if (!descricao || !valor) {
alert("Preencha tudo!");
return;
}

try {
await db.collection("financeiro").add({
descricao,
valor,
tipo,
mes
});

alert("Salvo com sucesso!");

document.getElementById("descricao").value = "";
document.getElementById("valor").value = "";

carregar();

} catch (erro) {
alert("Erro ao salvar!");
console.error(erro);
}
}

// 🔄 CARREGAR DADOS
async function carregar() {
saldo = 0;

const listaHTML = document.getElementById("lista");
listaHTML.innerHTML = "";

const query = await db.collection("financeiro").get();

query.forEach(doc => {
const data = doc.data();

// 💰 SALDO CORRETO
if (data.tipo === "entrada") {
saldo += data.valor;
} else {
saldo -= data.valor;
}

// 📄 ITEM
const li = document.createElement("li");

li.innerHTML = `
${data.descricao} - R$ ${data.valor} (${data.tipo})
<button onclick="excluir('${doc.id}')" style="margin-left:10px; background:red; color:white; border:none; padding:5px; cursor:pointer;">
X
</button>
`;

listaHTML.appendChild(li);
});

document.getElementById("saldo").innerText = "Saldo: R$ " + saldo;
}

// ❌ EXCLUIR
async function excluir(id) {
if (!confirm("Deseja excluir?")) return;

await db.collection("financeiro").doc(id).delete();

carregar();
}

// 📄 PDF
function gerarPDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.text("Relatório Financeiro", 10, 10);

let y = 20;

const itens = document.querySelectorAll("#lista li");

itens.forEach(item => {
doc.text(item.innerText.replace("X", ""), 10, y);
y += 10;
});

doc.text("Saldo: R$ " + saldo, 10, y + 10);

doc.save("relatorio.pdf");
}

// 🚀 INICIAR
carregar();
