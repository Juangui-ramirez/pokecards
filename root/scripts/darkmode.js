const btnDark = document.querySelector(".btnDark");
const background = document.body;

btnDark.addEventListener("click", function () {
  background.classList.toggle("darkMode");

  let theme;

  if (background.classList.contains("darkMode")) {
    theme = "Dark";
    btnDark.textContent = "Light mode";
  } else {
    theme = "Light";
    btnDark.textContent = "Dark mode";
  }

  localStorage.setItem("PageTheme", JSON.stringify(theme));
});

let getTheme = JSON.parse(localStorage.getItem("PageTheme"));

if (getTheme === "Dark") {
  document.body.classList = "darkMode";
  btnDark.textContent = "Light mode";
}
