'use strict';
const products=[
{name:'Клубника',description:'Нежный крем и сочные кусочки клубники.',image:'assets/strawberry.webp',price:190},
{name:'Манго',description:'Яркий вкус спелого манго в нежном креме.',image:'assets/mango.webp',price:190},
{name:'Фисташка',description:'Нежный крем с настоящей фисташкой.',image:'assets/pistachio.webp',price:190},
{name:'Шоколад',description:'Насыщенный вкус бархатного шоколада.',image:'assets/chocolate.webp',price:190},
{name:'Ваниль',description:'Та самая классика с нежной ванилью.',image:'assets/vanilla.webp',price:190},
{name:'Малина',description:'Освежающий вкус ароматной малины.',image:'assets/assorted.webp',price:190},
{name:'Набор «Все вкусы»',price:1140}
];
const money=value=>new Intl.NumberFormat('ru-RU').format(value)+' ₽';
let quantities=Array(products.length).fill(0);
try{const saved=JSON.parse(localStorage.getItem('idyllia-cart'));if(Array.isArray(saved)&&saved.length===7)quantities=saved.map(n=>Number.isInteger(n)&&n>=0&&n<=99?n:0);}catch{}
const catalog=document.getElementById('products');
products.slice(0,6).forEach((p,id)=>{const card=document.createElement('article');card.className='product';card.innerHTML=`<div class="product-image${id===5?' raspberry-photo':''}"><img src="${p.image}" alt="Моти ${p.name}" width="1536" height="1024" loading="lazy"></div><div class="product-body"><h3>${p.name}</h3><p>${p.description}</p><div class="price-row"><strong>${money(p.price)}/шт</strong><button class="add" data-add="${id}" aria-label="Добавить моти ${p.name}">+</button></div></div>`;catalog.append(card);});
const dialog=document.getElementById('cart');
let toastTimer;
function update(){try{localStorage.setItem('idyllia-cart',JSON.stringify(quantities));}catch{}document.getElementById('count').textContent=quantities.reduce((a,b)=>a+b,0);document.getElementById('total').textContent=money(quantities.reduce((a,n,i)=>a+n*products[i].price,0));const items=document.getElementById('cart-items');items.replaceChildren();quantities.forEach((n,id)=>{if(!n)return;const row=document.createElement('div');row.className='cart-item';row.innerHTML=`<span>${products[id].name}<br><small>${money(products[id].price*n)}</small></span><div class="quantity"><button data-change="${id}" data-delta="-1" aria-label="Убрать один: ${products[id].name}">−</button><span>${n}</span><button data-change="${id}" data-delta="1" aria-label="Добавить один: ${products[id].name}">+</button></div>`;items.append(row);});if(!quantities.some(Boolean))items.textContent='Ваша корзина пока пуста. Выберите любимые вкусы!';document.getElementById('copy-order').disabled=!quantities.some(Boolean);document.getElementById('copy-status').textContent='';}
document.addEventListener('click',event=>{const add=event.target.closest('[data-add]');if(add){const id=Number(add.dataset.add);if(quantities[id]>=99)return;quantities[id]++;update();const toast=document.getElementById('toast');toast.textContent=products[id].name+' — в корзине ♡';toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2200);}const change=event.target.closest('[data-change]');if(change){const id=Number(change.dataset.change);quantities[id]=Math.min(99,Math.max(0,quantities[id]+Number(change.dataset.delta)));update();}});
document.querySelector('.cart-open').addEventListener('click',()=>dialog.showModal());document.getElementById('close-cart').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.getElementById('copy-order').addEventListener('click',async()=>{const text='Идиллия Вкуса — мой список:\n'+products.map((p,i)=>quantities[i]?`${p.name} × ${quantities[i]} — ${money(p.price*quantities[i])}`:'').filter(Boolean).join('\n')+'\nИтого: '+document.getElementById('total').textContent;try{await navigator.clipboard.writeText(text);document.getElementById('copy-status').textContent='Список скопирован. Заказ ещё не отправлен.';}catch{document.getElementById('copy-status').textContent='Не удалось скопировать автоматически. Вы можете выделить и скопировать список в корзине.';}});
document.getElementById('year').textContent=new Date().getFullYear();update();
