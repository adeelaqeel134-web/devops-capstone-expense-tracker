const form=document.getElementById("expenseForm");
const list=document.getElementById("expenses");
const message=document.getElementById("message");

async function loadExpenses(){
  const r=await fetch("/api/expenses"), data=await r.json();
  list.innerHTML="";
  data.forEach(e=>{
    const li=document.createElement("li");
    li.innerHTML=`<div><strong>${safe(e.title)}</strong><br>${safe(e.category)} — $${Number(e.amount).toFixed(2)}</div><button data-id="${e.id}">Delete</button>`;
    list.appendChild(li);
  });
}
form.addEventListener("submit",async ev=>{
  ev.preventDefault();
  const body={title:title.value,amount:amount.value,category:category.value};
  const r=await fetch("/api/expenses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data=await r.json();
  message.textContent=data.error||"Expense added.";
  if(r.ok){form.reset();loadExpenses();}
});
list.addEventListener("click",async ev=>{
  if(!ev.target.dataset.id)return;
  await fetch("/api/expenses/"+ev.target.dataset.id,{method:"DELETE"});
  loadExpenses();
});
function safe(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
loadExpenses();
