//Defin variables
let sections =document.querySelectorAll(".sections");
let btnSection =document.querySelectorAll(".btnSection a");
let discTitle =document.querySelector(".discTitle");
let title =document.querySelector(".title");
let mealsContainer = document.querySelector("#recipes-grid");
let recipesCount = document.querySelector("#recipes-count");
let mealDetailsSection = document.querySelector("#meal-details");
let backBtn = document.querySelector("#back-to-meals-btn");
let addBtn  = document.querySelector("#confirm-log-meal");
let viewadd = document.querySelector("#log-meal-modal");
let modalBtn = document.querySelector("#log-meal-btn"); 
let cancelBtn = document.querySelector("#cancel-log-meal"); 
let searchSection = document.querySelector("#search-filters-section");
let categoriesSection = document.querySelector("#meal-categories-section");
let allRecipesSection = document.querySelector("#all-recipes-section");
let loggedList = document.querySelector("#logged-items-list");
let loggedCount = document.querySelector("#logged-items-count");
let clearAllBtn = document.querySelector("#clear-foodlog");
let totCaEl = document.getElementById("totca");
let MenuBtn = document.getElementById("header-menu-btn");
let sidebarClose = document.getElementById("sidebar-close-btn");
let sidebar = document.getElementById("sidebar");
let sidebarOverl = document.getElementById("sidebar-overlay");
let dateElement = document.getElementById("foodlog-date");
let searchInput = document.querySelector("#search-input");
let videoEl = document.querySelector("#video");
let videoContainer = document.querySelector("#video-container");



//sidebar-sections show
let sectionDesc = {
  "meals-recipes": "Discover delicious and nutritious recipes tailored for you",
  "products-section": "Search packaged foods by name or barcode",
  "foodlog-section": "Track your daily nutrition and food intake"
};
btnSection.forEach(btn => {
  btn.onclick = function() {
      title.innerText = btn.innerText;
      let id = btn.getAttribute("data-section");  
    sections.forEach(sec => sec.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    btnSection.forEach(b => b.classList.remove("bg-emerald-50", "text-emerald-700"));
    btn.classList.add("bg-emerald-50", "text-emerald-700");
    discTitle.innerText = sectionDesc[id] || "";
  }
});
function openSidebar() {
  sidebar.style.transform = 'translateX(0)';
  sidebarOverl.style.display = 'block';
  requestAnimationFrame(() => {
      sidebarOverl.classList.remove('hidden');
  });
}
function closeSidebar() {
  sidebar.style.transform = '';
  sidebarOverl.classList.add('hidden');
  
  setTimeout(() => {
      if (sidebarOverl.classList.contains('hidden')) {
          sidebarOverl.style.display = 'none';
      }
  }, 300);
}
MenuBtn.onclick = openSidebar;
sidebarClose.onclick = closeSidebar;
sidebarOverl.onclick = closeSidebar;
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeSidebar();
  });
});

//Meals & Recipes
async function displayMeals() {
  let req = await fetch(`https://nutriplan-api.vercel.app/api/meals/areas`);
  let obj = await req.json();
  let countery = obj.results.map(meal => meal.name).slice(0, 10);

  let cartona = `<button
    class="area-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all"
  >
  All Cuisines
  </button>`;

  for (let i = 0; i < countery.length; i++) {
    cartona += `<button
      class="area-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
    >
     ${countery[i]}
    </button>`;
  }
  let cartonaActive = document.querySelector(".areas");
  cartonaActive.innerHTML = cartona;
  let allBtnArea = document.querySelectorAll(".area-btn");
  allBtnArea.forEach((btnarea) => {
    btnarea.onclick = function () {
      allBtnArea.forEach((b) => {
        b.classList.remove("bg-emerald-600", "text-white");
        b.classList.add("bg-gray-100", "text-gray-700");
      });
      this.classList.remove("bg-gray-100", "text-gray-700");
      this.classList.add("bg-emerald-600", "text-white");

      let areaName = this.innerText.trim();
      if (areaName === "All Cuisines") {
        getMealsByCategory("Beef");
      } else {
        getMealsByArea(areaName);
      }
    };
  });
}
displayMeals();

//all category
async function Meals() {
  let req = await fetch(`https://nutriplan-api.vercel.app/api/meals/categories`);
  let obj = await req.json();
  let categoriesData = obj.results.slice(0, 12);

  const categoryConfig = {
    "Beef": { bg: "#FFF1F1", border: "#FFD5D5", iconBg: "linear-gradient(135deg, #FF4D67, #FF8A9B)", icon: "fa-drumstick-bite" },
    "Chicken": { bg: "#FFF9EB", border: "#FFE8B3", iconBg: "linear-gradient(135deg, #FFAB00, #FFD071)", icon: "fa-drumstick-bite" },
    "Dessert": { bg: "#FFF0F6", border: "#FFD1E3", iconBg: "linear-gradient(135deg, #FF4D94, #FF85B3)", icon: "fa-cake-candles" },
    "Lamb": { bg: "#FFF8F0", border: "#FFE1B3", iconBg: "linear-gradient(135deg, #FF9100, #FFB347)", icon: "fa-drumstick-bite" },
    "Miscellaneous": { bg: "#F4F7FC", border: "#DCE4F2", iconBg: "linear-gradient(135deg, #7B829A, #A3A9BC)", icon: "fa-bowl-rice" },
    "Pasta": { bg: "#FFFBEB", border: "#FFEFB3", iconBg: "linear-gradient(135deg, #FFB300, #FFD54F)", icon: "fa-bowl-food" },
    "Pork": { bg: "#FFF1F1", border: "#FFD5D5", iconBg: "linear-gradient(135deg, #FF5C6E, #FF8E9A)", icon: "fa-bacon" },
    "Seafood": { bg: "#F0F9FF", border: "#D1EDFF", iconBg: "linear-gradient(135deg, #00B2FF, #54D1FF)", icon: "fa-fish" },
    "Side": { bg: "#EDFBF4", border: "#C8F2E0", iconBg: "linear-gradient(135deg, #00D27B, #52E0A5)", icon: "fa-plate-wheat" },
    "Starter": { bg: "#F0FDFF", border: "#D1F7FF", iconBg: "linear-gradient(135deg, #00C3E3, #59DCEF)", icon: "fa-utensils" },
    "Vegan": { bg: "#F0FFF7", border: "#D1FCE7", iconBg: "linear-gradient(135deg, #00D977, #56E8A3)", icon: "fa-leaf" },
    "Vegetarian": { bg: "#F7FFE5", border: "#E6FFB3", iconBg: "linear-gradient(135deg, #72E600, #A2F24D)", icon: "fa-seedling" }
  };

  let cartona = "";
  for (let i = 0; i < categoriesData.length; i++) {
    let categoryName = categoriesData[i].name;
    let config = categoryConfig[categoryName] || { bg: "#f3f4f6", border: "#e5e7eb", iconBg: "#9ca3af", icon: "fa-utensils" };

    cartona += `
    <div
      class="category-card rounded-xl p-3 border hover:shadow-md cursor-pointer transition-all group"
      style="background-color: ${config.bg}; border-color: ${config.border};"
      data-category="${categoryName}"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="text-white w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
          style="background: ${config.iconBg};"
        >
          <i class="fa-solid ${config.icon}"></i>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">${categoryName}</h3>
        </div>
      </div>
    </div>`;
  }
  document.querySelector("#categories-grid").innerHTML = cartona;
  let categoryMails = document.querySelectorAll(".category-card");
  categoryMails.forEach(card => {
    card.addEventListener("click", async function() {
      let categorieName = this.getAttribute("data-category");
      await getMealsByCategory(categorieName);
    });
  });
}
Meals();

getMealsByCategory("Chicken");
//get mails with category
async function getMealsByCategory(category) {
  const mealsContainer = document.querySelector("#recipes-grid");
  if (!mealsContainer) return;

  mealsContainer.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">
  Downloading recipes${category}...
  </div>`;

  try {
    let response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/filter?category=${category}&page=1&limit=25`
    );
    let data = await response.json();
    renderMeals(data.results || [], category);
  } catch (error) {
    console.error(error);
    mealsContainer.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">
    An error occurred while loading the data.
    </div>`;
  }
}

//get mails with areas
async function getMealsByArea(area) {
  const mealsContainer = document.querySelector("#recipes-grid");
  if (!mealsContainer) return;

  mealsContainer.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">
  Downloading recipes ${area}...
  </div>`;

  try {
    let response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/filter?area=${area}&page=1&limit=25`
    );
    let data = await response.json();
    renderMeals(data.results || [], area);
  } catch (error) {
    console.error(error);
    mealsContainer.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">
    An error occurred while loading the data.
    </div>`;
  }
}

//show boxes mails
function renderMeals(meals, label) {
  const mealsContainer = document.querySelector("#recipes-grid");
  const recipesCount = document.querySelector("#recipes-count");
  if (!mealsContainer || !recipesCount) return;

  mealsContainer.innerHTML = "";
  recipesCount.innerText = `Showing ${meals.length} ${label} recipes`;

  let mealsHtml = "";
  meals.forEach(meal => {
    let descText = Array.isArray(meal.instructions) ? meal.instructions.join(' ') : (meal.instructions || "");
    let safeDescription = descText.substring(0, 80) + "...";

    mealsHtml += `
      <div
        class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        data-meal-id="${meal.id}"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src="${meal.thumbnail}" 
            alt="${meal.name}"
            loading="lazy"
          />
          <div class="absolute bottom-3 left-3 flex gap-2">
            <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
              ${meal.category}
            </span>
            <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
              ${meal.area}
            </span>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
            ${meal.name}
          </h3>
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">${safeDescription}</p>
        </div>
      </div>`;
  });

  mealsContainer.innerHTML = mealsHtml;
  setupMealClick(meals);
}


let selectedMealName = "";
let selectedMealCalories = 0;
userMails=[];
userMails = JSON.parse(localStorage.getItem("allMeals")) || [];
//section nutrition
async function nutrition(mealName) {
  let calories = 0;
  const API_KEY = "iR3KHp7HFC7XNh8osPY7tDMDJ5ghBuzleZBzLO2m";
  
  const loaderId = "api-loader";
  let loader = document.getElementById(loaderId);
  if (!loader) {
    loader = document.createElement("div");
    loader.id = loaderId;
    loader.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; margin: 20px;">
        <div class="spinner-icon" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 10px; font-family: Arial, sans-serif;">Searching for ${mealName}...</p>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;
    document.body.appendChild(loader); 
  }

  try {
    const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(mealName)}&pageSize=1&api_key=${API_KEY}`);
    const data = await res.json();
    const food = data.foods?.[0];

    if (!food) {
        alert("Meal not found!");
        return;
    }

    const getNutrient = (name) => {
      const nutrient = food.foodNutrients?.find(n => n.nutrientName.includes(name));
      return nutrient ? nutrient.value : "0";
    };
    calories=Number(getNutrient("Energy")) || 0;
      calories=getNutrient("Energy");
    document.querySelector("#nutritionC").innerText=calories;
    document.querySelector("#hero-calories").innerText=calories + " cal/serving";
    document.querySelector("#modal-calories").innerText=calories;
    document.querySelector("#Protein").innerText=getNutrient("Protein");
    document.querySelector("#modal-protein").innerText=getNutrient("Protein");
    document.querySelector("#Carbs").innerText=getNutrient("Carbohydrate");
    document.querySelector("#modal-carbs").innerText=getNutrient("Carbohydrate");
    document.querySelector("#Fat").innerText=getNutrient("Total lipid");
    document.querySelector("#modal-fat").innerText=getNutrient("Total lipid");
    document.querySelector("#Fiber").innerText=getNutrient("Fiber");
    document.querySelector("#Sugar").innerText=getNutrient("Sugars");
    document.querySelector("#VitaminA").innerText=getNutrient("Vitamin A");
    document.querySelector("#VitaminC").innerText=getNutrient("Vitamin C");
    document.querySelector("#Calcium").innerText=getNutrient("Calcium");
    document.querySelector("#Iron").innerText=getNutrient("Iron");
    if(document.querySelector("#nutritionT")) {
      document.querySelector("#nutritionT").innerText = `Total: ${calories * 4} cal`;
    }

  } catch (err) {
    console.error("Nutrition API Error:", err);
  } finally {
    if (loader) loader.remove();
  }
  return calories;
}

//setup Meal Click
function setupMealClick(meals) {
  document.querySelectorAll(".recipe-card").forEach((card) => {
    card.addEventListener("click", () => {
      const mealId = card.getAttribute("data-meal-id");
      const meal = meals.find((m) => m.id === mealId);
      if (!meal) return;

      if (searchSection) searchSection.classList.add("hidden");
      if (categoriesSection) categoriesSection.classList.add("hidden");
      if (allRecipesSection) allRecipesSection.classList.add("hidden");
      mealDetailsSection.classList.remove("hidden");
 
      document.querySelector("#imag-cover").src = meal.thumbnail;
      document.querySelector("#addimg").src = meal.thumbnail;
      document.querySelector("#name-mail").innerText = meal.name;
      document.querySelector("#addmeal").innerText = meal.name;
      document.querySelector("#category").innerText = meal.category;
      document.querySelector("#country").innerText = meal.area;
      document.querySelector("#type").innerText = (meal.tags && meal.tags.join(", ")) || "N/A";

      const ingredientsContainer = document.querySelector("#ingredients-list");
      const itemsCountLabel = document.querySelector("#items-count");
      if (ingredientsContainer) {
        ingredientsContainer.innerHTML = "";
        const ingredients = meal.ingredients || [];
        if (itemsCountLabel) itemsCountLabel.innerText = `${ingredients.length} items`;

        ingredients.forEach((ing, index) => {
          const el = document.createElement("div");
          el.className = "flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group";
          el.innerHTML = `
            <input type="checkbox" id="ing-${index}" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300 cursor-pointer focus:ring-emerald-500" />
            <label for="ing-${index}" class="text-gray-700 cursor-pointer flex-grow select-none">
                <span class="font-bold text-gray-900">${ing.measure || ""}</span> ${ing.ingredient}
            </label>`;
          ingredientsContainer.appendChild(el);
        });
      }

      const instructionsContainer = document.querySelector("#instructions-list");
      if (instructionsContainer) {
        instructionsContainer.innerHTML = "";
        (meal.instructions || []).forEach((inst, index) => {
          if (inst.trim()) {
            const instEl = document.createElement("div");
            instEl.className = "flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors";
            instEl.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">${index + 1}</div>
                <p class="text-gray-700 leading-relaxed pt-2">${inst}</p>`;
            instructionsContainer.appendChild(instEl);
          }
        });
      }

const youtubeUrl = meal.youtube?.trim();
const videoId = youtubeUrl?.match(/(?:v=|\/embed\/|youtu\.be\/)([^?&]+)/)?.[1];
if (videoId) {
    videoEl.src = `https://www.youtube.com/embed/${videoId}`;
    videoContainer?.classList.remove("hidden");
} else {
    videoEl.src = "";
    videoContainer?.classList.add("hidden");
}

      if (meal.name) {
        selectedMealName = meal.name;
        nutrition(meal.name).then(cal => {
          selectedMealCalories = cal;
        });
      }
      
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      mealDetailsSection.classList.add("hidden");
      if (searchSection) searchSection.classList.remove("hidden");
      if (categoriesSection) categoriesSection.classList.remove("hidden");
      if (allRecipesSection) allRecipesSection.classList.remove("hidden");


      const videoEl = document.querySelector("#video");
      if(videoEl) videoEl.src = "";
    });
  }

}

//add product
function addproduct() {
  modalBtn.addEventListener("click", () => {
    viewadd.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    viewadd.classList.add("hidden");
  });

  addBtn.addEventListener("click", function() {
  userMails.push({
    name: selectedMealName,
    calories: selectedMealCalories,
    protein: document.querySelector("#modal-protein").innerText,
    carbs: document.querySelector("#modal-carbs").innerText,
    fat: document.querySelector("#modal-fat").innerText,
    image: document.querySelector("#addimg").src,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

      viewadd.classList.add("hidden");
      syncData(); 
      display();  
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Meal Logged!",
        html: `${selectedMealName} (1 serving) has been added to your daily log <br><br>
          <b><span style="color:#28a745">+${selectedMealCalories} Calories</span></b>`,
        showConfirmButton: false,
        timer: 1500
      });
      
 
  });
  syncData()
}
addproduct();

//display product
function display() {
  let cartona = "";

  if (clearAllBtn) {
    clearAllBtn.style.display = userMails.length > 0 ? "block" : "none";
  }
  

  if (userMails.length === 0) {
    cartona = `
      <div id="hidd" class="text-center py-8 text-gray-500">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="text-3xl text-gray-300">
                  <svg class="svg-inline--fa fa-utensils w-10 h-10" viewBox="0 0 512 512"><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg>
              </i>
          </div>
          <p class="font-medium">No meals logged today</p>
          <p class="text-sm mb-4">Add meals from the Meals page or scan products</p>
          <div class="flex justify-center gap-3">
              <a href="#meals" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                  Browse Recipes
              </a>
              <a href="/products" class="nav-link inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  Scan Product
              </a>
          </div>
      </div>`;
  } else {

    for (let i = 0; i < userMails.length; i++) {
      cartona += `
      <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all mb-3">
        <div class="flex items-center gap-4">
          <img src="${userMails[i].image}" class="w-14 h-14 rounded-xl object-cover">
          <div>
            <p class="font-semibold text-gray-900">${userMails[i].name}</p>
            <p class="text-sm text-gray-500">1 serving • <span class="text-emerald-600">Recipe</span></p>
            <p class="text-xs text-gray-400 mt-1">${userMails[i].time}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-lg font-bold text-emerald-600">${userMails[i].calories}</p>
            <p class="text-xs text-gray-500">kcal</p>
          </div>
          <div class="hidden md:flex gap-2 text-xs text-gray-500">
            <span class="px-2 py-1 bg-blue-50 rounded">${userMails[i].protein} P</span>
            <span class="px-2 py-1 bg-amber-50 rounded">${userMails[i].carbs} C</span>
            <span class="px-2 py-1 bg-purple-50 rounded">${userMails[i].fat} F</span>
          </div>
          <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${i}">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      </div>`;
    }
  }
  loggedList.innerHTML = cartona;
    if(loggedCount) {
      loggedCount.innerText = `Logged Items (${userMails.length})`;
  }

  update()
  deleteMails();
}
display();

function syncData() {
  localStorage.setItem("allMeals", JSON.stringify(userMails)); 
  display(); 
}

//delete Mails
function deleteMails() {
  const container = document.querySelector("#logged-items-list");
  if (!container) return;

  container.querySelectorAll(".remove-foodlog-item").forEach(btn => {
    btn.onclick = function () {
      const index = Number(this.getAttribute("data-index"));
      if (!isNaN(index) && index >= 0 && index < userMails.length) {
        userMails.splice(index, 1); 
        display(); 
        syncData();
      }
    };
  });
}

//btn clear All
if (clearAllBtn) {
  clearAllBtn.onclick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        userMails = []; 
        syncData()
        display(); 
        
        Swal.fire({
          title: "Deleted!",
          text: "Your daily log has been cleared.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };
}

//Update Mails
function update() {
  const date = new Date();
  const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);

  if (dateElement) dateElement.innerText = formattedDate;
  let totals = { cal: 0, pro: 0, carb: 0, fat: 0 };
  const goals = { cal: 2000, pro: 50, carb: 250, fat: 65 };

  userMails.forEach(meal => {
    totals.cal += parseFloat(meal.calories) || 0;
    totals.pro += parseFloat(meal.protein) || 0;
    totals.carb += parseFloat(meal.carbs) || 0;
    totals.fat += parseFloat(meal.fat) || 0;
  });

  if (totCaEl) totCaEl.innerText = Math.round(totals.cal);
  const updateMetric = (id, current, goal, unit, defaultColorClass) => {
    const textElement = document.getElementById(id);
    if (!textElement) return;
    
    textElement.innerText = `${Math.round(current)} / ${goal} ${unit}`;
    const barContainer = textElement.parentElement.nextElementSibling;
    const bar = barContainer.querySelector('div');
    let percentage = (current / goal) * 100;
    bar.style.width = (percentage > 100 ? 100 : percentage) + "%";

    if (current > goal) {
      bar.classList.remove(defaultColorClass);
      bar.classList.add("bg-red-500");
    } else {
      bar.classList.remove("bg-red-500");
      bar.classList.add(defaultColorClass);
    }
  };

  updateMetric("CaloriesTot", totals.cal, goals.cal, "kcal", "bg-emerald-500");
  updateMetric("ProteinTot", totals.pro, goals.pro, "g", "bg-blue-500");
  updateMetric("CarbsTot", totals.carb, goals.carb, "g", "bg-amber-500");
  updateMetric("FatTot", totals.fat, goals.fat, "g", "bg-purple-500");
}

//search of Meals
function searchMeals() {
  searchInput.addEventListener("input", async function() {
    const query = searchInput.value.trim();
  
    if (query === "") {
      recipesCount.innerText = `Showing Chicken recipes`;
      getMealsByCategory("Chicken");
      return;
    }
  
    mealsContainer.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">
        Searching for "${query}"...
      </div>`;
  
    try {
      const response = await fetch(`https://nutriplan-api.vercel.app/api/meals/search?q=${encodeURIComponent(query)}&page=1&limit=25`);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const data = await response.json();
  
      if (!data.results || data.results.length === 0) {
        mealsContainer.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">
            No results found for "${query}".
          </div>`;
        recipesCount.innerText = `No results for "${query}"`;
        return;
      }
  
      renderMeals(data.results, `Search results for "${query}"`);
    } catch (error) {
      console.error(error);
      mealsContainer.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">
          Error searching for meals: ${error.message}
        </div>`;
    }
  });
}
searchMeals();

  







