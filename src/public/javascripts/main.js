$(() => {
  function updateSelectBox({ type, id, name, className, queryName }) {
    if (type === "add")
      $(`.${className}`).each(function () {
        $(this).append(
          `<option value='${id}'  query-name="${queryName}">${name}</option>`
        );
      });

    if (type === "remove")
      $(`.${className}`).each(function () {
        $(this).find(`option[value='${id}']`).remove();
      });
  }

  async function fillBrand(cs, queryName) {
    if (!queryName) return;
    if (!$(cs).children());

    const brands = (await axios.get(`/api/brand-from-category/${queryName}`))
      .data;
    $(cs).children().remove();

    brands.forEach((brand) => {
      $(cs).append(`<option value='${brand._id}'>${brand.name}</option>`);
    });
  }

  async function updateCategoryWithBrand() {
    const categoryWithBrandClass = $(".category-brand");

    for (let i = 0; i < categoryWithBrandClass.length; i++) {
      const cb = categoryWithBrandClass[i];
      const categoryQueryName = $(cb)
        .find(".category option")
        .first()
        .attr("query-name");

      fillBrand($(cb).find(".brand"), categoryQueryName);
    }
  }

  (async function () {
    await updateCategoryWithBrand();
  })();

  /* Category Add - Delete */
  $("#categoryFormAdd .submit").click(async function (e) {
    e.preventDefault();
    const form = $(this).parents("#categoryFormAdd");
    const formInputs = form
      .serializeArray()
      .map((v) => ({ [v.name]: v.value }));

    try {
      const response = (
        await axios.post("/api/category", {
          ...formInputs[0],
        })
      ).data;

      toastr["success"]("Successfully added");
      $(form).find("input[type=text]").val("");

      updateSelectBox({
        type: "add",
        id: response._id,
        name: response.name,
        queryName: response.queryName,
        className: "category",
      });
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });
  $("#categoryFormDelete .submit").click(async function (e) {
    e.preventDefault();
    const form = $(this).parents("#categoryFormDelete");
    const categoryId = form.find("#categoryId").val();

    try {
      await axios.delete("/api/category/" + categoryId);
      updateSelectBox({
        type: "remove",
        id: categoryId,
        className: "category",
      });
      await updateCategoryWithBrand();

      toastr["success"]("Successfully deleted");
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });

  /* Brand Add - Delete */
  $("#brandFormAdd .submit").click(async function (e) {
    e.preventDefault();
    const form = $(this).parents("#brandFormAdd");
    const categoryId = form.find("#categoryId").val();
    const name = form.find("#name").val();

    try {
      const response = (
        await axios.post("/api/brand", {
          category: categoryId,
          name,
        })
      ).data;

      toastr["success"]("Successfully added");
      $(form).find("input[type=text]").val("");

      updateSelectBox({
        type: "add",
        id: response._id,
        name: response.name,
        className: "brand",
      });

      await updateCategoryWithBrand();
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });
  $("#brandFormDelete .submit").click(async function (e) {
    e.preventDefault();
    const form = $(this).parents("#brandFormDelete");
    const categoryId = form.find(".brand").val();

    try {
      await axios.delete("/api/brand/" + categoryId);
      updateSelectBox({
        type: "remove",
        id: categoryId,
        className: "brand",
      });

      await updateCategoryWithBrand();

      toastr["success"]("Successfully deleted");
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });

  /* Product Add - delete */
  $("#productFormAdd .submit").click(async function (e) {
    e.preventDefault();
    const form = $(this).parents("#productFormAdd");
    const brandId = form.find("#brandId").val();
    const name = form.find("#name").val();
    const features = form.find("#features").val();
    const price = Number(form.find("#price").val());
    const images = form
      .find("#images")
      .val()
      .split(",")
      .map((image) => ({ url: image }));

    try {
      const response = (
        await axios.post("/api/product", {
          brand: brandId,
          name,
          price,
          images,
          features,
        })
      ).data;

      toastr["success"]("Successfully added");
      $(form).find("input, textarea").val("");

      updateSelectBox({
        type: "add",
        id: response._id,
        name: response.name,
        className: "brand",
      });
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });
  $("#productFormDelete .submit").click(async function (e) {
    e.preventDefault();
    const form = $(this).parents("#productFormDelete");
    const name = form.find("#name").val();

    try {
      await axios.delete("/api/product-name/" + name);

      form.find("#name").val("");
      toastr["success"]("Successfully deleted");
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });

  $(".category-brand .category").on("change", async function () {
    const id = $(this).val();
    const queryName = $(this).find(`option[value='${id}']`).attr("query-name");
    await fillBrand(
      $(this).parents(".category-brand").find(".brand"),
      queryName
    );
  });

  /* Register */
  $("#register").on("click", async function (e) {
    e.preventDefault();
    const form = $(this).parent("form");

    const fullName = $(form).find("input[name='name']").val();
    const email = $(form).find("input[name='email']").val();
    const password = $(form).find("input[name='password']").val();
    const confirmPasword = $(form).find("input[name='password2']").val();
    if (password != confirmPasword)
      return toastr["error"]("büle passwordun icine soxam");

    try {
      await axios.post("/api/register", {
        fullName,
        email,
        password,
      });

      toastr["success"]("Successfully register");
      setTimeout(() => {
        window.location = "/login";
      }, 2 * 1000);
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });

  // login
  $("#login").on("click", async function (e) {
    e.preventDefault();
    const form = $(this).parent("form");

    const email = $(form).find("input[name='email']").val();
    const password = $(form).find("input[name='password']").val();
    try {
      await axios.post("/api/login", {
        email,
        password,
      });

      toastr["success"]("Successfully login");
      setTimeout(() => {
        window.location = "/";
      }, 2 * 1000);
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });

  //add product
  $(".add-basket").on("click", async function (e) {
    e.preventDefault();
    const productId = $(this).attr("id");
    try {
      await axios.get(`/api/add-basket?productId=${productId}`);

      toastr["success"]("Successfully product added");
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });

  $(".remove-basket").on("click", async function (e) {
    e.preventDefault();
    const productId = $(this).attr("id");
    try {
      await axios.get(`/api/remove-basket?productId=${productId}`);

      $(this).parents("tr").remove();

      toastr["success"]("Successfully product removed");
      // $(this).text("sepete ekle");
      // $(this).toggleClass("remove-basket", "add-basket");
    } catch (error) {
      toastr["error"](error.response.data.message || error.message);
    }
  });
});
