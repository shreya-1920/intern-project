let products = [];
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];


async function loadProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  products = await res.json();

  loadCategories();
  displayProducts(products);
}

loadProducts();


function loadCategories() {
  const cat = document.getElementById("categoryFilter");
  const categories = ["All", ...new Set(products.map(p => p.category))];

  cat.innerHTML = categories
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");
}


function displayProducts(list) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  list.forEach(p => {
    grid.innerHTML += `
      <div class="card" onclick="showModal(${p.id})">
        <img src="${p.image}" />
        <h4>${p.title.slice(0, 30)}...</h4>
        <p><b>$${p.price}</b></p>
        <button onclick="event.stopPropagation(); toggleFav(${p.id})">
          ${favourites.includes(p.id) ? "★ Added" : "☆ Add to Favourites"}
        </button>
      </div>
    `;
  });
}


function showModal(id) {
  const p = products.find(x => x.id == id);
  document.getElementById("modalTitle").innerText = p.title;
  document.getElementById("modalImg").src = p.image;
  document.getElementById("modalDesc").innerText = p.description;
  document.getElementById("modalPrice").innerText = p.price;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}


document.getElementById("searchBox").addEventListener("input", filterAll);
document.getElementById("categoryFilter").addEventListener("change", filterAll);
document.getElementById("sortFilter").addEventListener("change", filterAll);

function filterAll() {
  let list = [...products];

  
  const q = document.getElementById("searchBox").value.toLowerCase();
  list = list.filter(p => p.title.toLowerCase().includes(q));

 
  const cat = document.getElementById("categoryFilter").value;
  if (cat !== "All") list = list.filter(p => p.category === cat);

 
  const sort = document.getElementById("sortFilter").value;
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);

  displayProducts(list);
}


function toggleFav(id) {
  if (favourites.includes(id)) {
    favourites = favourites.filter(x => x !== id);
  } else {
    favourites.push(id);
  }
  localStorage.setItem("favourites", JSON.stringify(favourites));
  displayProducts(products);
}


document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("themeToggle").innerText =
    document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
});
