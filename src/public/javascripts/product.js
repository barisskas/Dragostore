// alert("hello world");
$(() => {
  const loadingDiv = $("#loading");
  const brandSelectDiv = $(".brand");
  const productsDiv = $("#products");
  const priceButton = $(".price-search");

  const minPriceTextbox = $("#minPrice");
  const maxPriceTextbox = $("#maxPrice");

  const categoryNameInput = $("#categoryName");

  let brands = [];
  let url = new URL(
    `http://localhost:3000/api/product?category=${categoryNameInput.attr(
      "category-name"
    )}`
  );

  function loading(type) {
    if (type) loadingDiv.css({ display: "flex" });
    else loadingDiv.hide();
  }

  function addProduct(product) {
    const productHTML = `
    <div class="col-lg-4 product-col">
          <div class="card product-card adminincard">
            <img src="/images/deneme.png" class="card-img-top" alt="..." />
            <div class="card-body">
              <div class="card-title product-name">${product.name}</div>
              <p class="card-text">${product.features}</p>
              <div
                class="card-title product-price shopping-basket filtersearch"
              >
                ${product.price + " TL"}
              </div>
            </div>
            <div class="card-header admincardheader bg-neonBlue product-select">
              <h6>seçiniz</h6>
            </div>
          </div>
        </div>
    `;

    productsDiv.append(productHTML);
  }

  brandSelectDiv.on("change", async function () {
    loading(true);
    const brandId = String($(this).val());

    const currentBrandIndex = brands.findIndex((b) => b == brandId);

    if (currentBrandIndex == -1) brands.push(brandId);
    else brands.splice(currentBrandIndex, 1);

    url.searchParams.set("brandIds", JSON.stringify(brands));

    console.log(url);

    const response = (await axios.get(`${url}`)).data;

    productsDiv.children().remove();
    response.forEach(addProduct);

    console.log(response);
    loading(false);
  });

  priceButton.on("click", async function () {
    let query = "";

    const minPrice = Number(minPriceTextbox.val());
    const maxPrice = Number(maxPriceTextbox.val());

    if (minPrice) url.searchParams.set("minPrice", minPrice);

    if (maxPrice) url.searchParams.set("maxPrice", maxPrice);

    const response = (await axios.get(url)).data;

    productsDiv.children().remove();
    response.forEach(addProduct);
  });
});
