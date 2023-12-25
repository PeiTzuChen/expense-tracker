const data = document.querySelectorAll(".list-group-item");
data.forEach((element) => {
  const id = element.dataset.id;
  if (id % 2 === 0) element.style.backgroundColor = "#faf0e6";
});
