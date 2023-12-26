const data = document.querySelectorAll(".list-group-item");
data.forEach((element) => {
  const id = element.dataset.id;
  if (id % 2 === 0) element.style.backgroundColor = "#faf0e6";
});

const form = document.querySelector("#category-form");
const select = document.querySelector("#category-select");

select.addEventListener("change", (event) => {
  form.submit();
});

const pageForm = document.querySelector("#page-number-form");
const pageNumber = document.querySelector("#page-number");

pageNumber.addEventListener("change", (event) => {
  pageForm.submit();
});