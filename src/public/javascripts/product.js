// alert("hello world");
$(() => {
  const loadingDiv = $("#loading");
  const brandSelectDiv = $(".brand");

  let brands = [];

  function loading(type) {
    if (type) loadingDiv.css({ display: "flex" });
    else loadingDiv.hide();
  }

  brandSelectDiv.on("change", async function () {
    loading(true);
    const brandId = String($(this).val());

    brands.push(brandId);

    const response = (
      await axios.get(`/api/product?brandIds=${JSON.stringify(brands)}`)
    ).data;

    console.log(response);
    loading(false);
  });
});
