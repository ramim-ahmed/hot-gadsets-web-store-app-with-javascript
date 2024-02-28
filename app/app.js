const searchButton = document.querySelector("#search_button");
const searchInput = document.querySelector("#search_input");
const showAllButtonContainer = document.querySelector("#show_all_container");
const productNotFoundContainer = document.querySelector("#product_not_found");
const showAllButton = document.querySelector("#show_all_button");
// fetch all phones
const fetchPhones = async (searchValue) => {
  try {
    loadingShowing(true);
    const URL = `https://openapi.programming-hero.com/api/phones?search=${searchValue}`;
    const res = await fetch(URL);
    const phones = await res.json();
    return phones;
  } catch (error) {
    console.log("fetching phones error", error);
    loadingShowing(false);
  }
};

const fetchPhoneFeatues = async (slug) => {
  const URL = `https://openapi.programming-hero.com/api/phone/${slug}`;
  try {
    loadingShowing(true);
    const res = await fetch(URL);
    const features = await res.json();
    return features;
  } catch (error) {
    console.log("fetch Phone features Error", error);
    loadingShowing(false);
  }
};

const fetchPhonesWithFeatues = async (searchValue, isShow) => {
  try {
    loadingShowing(true);
    const phones = await fetchPhones(searchValue);
    const allData = await Promise.all(
      phones.data.map(async (phone) => {
        const { data: features } = await fetchPhoneFeatues(phone.slug);
        return { ...phone, features };
      })
    );
    displayProductCard(allData, isShow);
  } catch (error) {
    console.log("fetch phone with features error", error);
    loadingShowing(false);
  }
};

const displayProductCard = (data, isShow) => {
  const productsCardContainer = document.querySelector("#products_container");
  productsCardContainer.innerHTML = "";
  let phonesData = data;
  if (data.length > 12 && !isShow) {
    showAllButtonContainer.classList.remove("hidden");
  } else {
    showAllButtonContainer.classList.add("hidden");
  }
  if (data.length <= 0) {
    productNotFoundContainer.classList.remove("hidden");
  } else {
    productNotFoundContainer.classList.add("hidden");
  }
  if (!isShow) {
    phonesData = data.slice(0, 12);
  }
  phonesData.forEach((phone) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList = "border border-gray-200 rounded-sm w-80";
    cardContainer.innerHTML = `<div class="bg-[#0D6EFD0D] m-2 flex justify-center items-center">
    <img src="${phone.image}" alt="" />
  </div>
  <div class="m-2 text-center px-5 mt-4">
    <h2 class="text-2xl text-[#403F3F] font-bold">
      ${phone.phone_name}
    </h2>
    <p class="my-5">
      There are many variations of passages of available, but the
      majority have suffered
    </p>
    <p class="text-2xl font-bold text-[#403F3F] mb-4">$999</p>
    <button onclick="showDetailsProduct('${phone.slug}')" type="button" class="bg-[#0D6EFD] px-6 py-1 text-white">
      Show Details
    </button>
  </div>`;
    productsCardContainer.appendChild(cardContainer);
  });
  loadingShowing(false);
};

const loadingShowing = (param) => {
  const loadingContainer = document.querySelector("#loading_container");
  if (param) {
    loadingContainer.classList.remove("hidden");
  } else {
    loadingContainer.classList.add("hidden");
  }
};

const showDetailsProduct = async (slug) => {
  const { data } = await fetchPhoneFeatues(slug);
  console.log(data);
  const modalBoxContainer = document.querySelector("#modal_box_container");
  modalBoxContainer.innerHTML = `<form method="dialog">
    <button
      class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    >
      ✕
    </button>
  </form>
  <div class="bg-[#0D6EFD0D] flex justify-center items-center h-80">
    <img src="${data?.image}" alt="" />
  </div>
  <h3 class="font-bold text-2xl mt-4">${data?.name}</h3>
  <p class="py-4">
    It is a long established fact that a reader will be distracted by
    the readable content of a page when looking at its layout.
  </p>
  <div class="space-y-2">
    <p>
      <strong>Storage</strong>: ${data?.mainFeatures?.storage || "N/A"}
    </p>
    <p><strong>Display Size</strong>: ${
      data?.mainFeatures?.displaySize || "N/A"
    }</p>
    <p><strong>Chipset</strong>:  ${data?.mainFeatures?.chipSet || "N/A"}</p>
    <p>
      <strong>Memory</strong>: ${data?.mainFeatures?.memory || "N/A"}
    </p>
    <p><strong>Slug</strong>: ${data?.slug || "N/A"}</p>
    <p><strong>Release data</strong>: ${data?.releaseDate || "N/A"}</p>
    <p><strong>Brand</strong>: ${data?.brand || "N/A"}</p>
    <p>
      <strong>GPS</strong>: AYes, with A-GPS, GLONASS, GALILEO, BDS,
      QZSS
    </p>
  </div>`;
  my_modal_3.showModal();
  loadingShowing(false);
};

const handleSearchHandle = (isShow) => {
  const inputValue = searchInput.value;
  fetchPhonesWithFeatues(inputValue || "iphone", isShow);
};
const handleShowAllButton = () => {
  handleSearchHandle(true);
};

fetchPhonesWithFeatues("iphone");
