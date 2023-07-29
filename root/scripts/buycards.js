let url = "https://pokeapi.co/api/v2";
let offset = 0;
let limit = 20;
let countCards = 0;
let pokemons = [];
let typesPokemon = [];
let pokemonType = "all";
const container = document.querySelector(".grid-container");

const renderCards = (pokemons) => {
  pokemons.forEach(async (pokemon) => {
    //Create card Pokemon
    let pokeCard = document.createElement("div");
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    pokeCard.className = "pokeCard";
    pokeCard.innerHTML = `
          <div class = "headerCard">
              <p>${capitalizedName}</p>
              <i class = "far fa-heart heart"></i>
          </div>
          <img class = "imgPoke" src = "${pokemon.sprites.front_default}">
          <div class = "footerCard">
              <p>Exp ${pokemon.base_experience}</p>
              <a href = "./pokemonDetails.html?pokemon=${pokemon.id}">
              <button class = "btnCard">Buy</button>
              </a>
          </div>`;

    //Select div container and push cards
    container.appendChild(pokeCard);

    //Count cards
    countCards++;
    const totalCards = document.querySelector(".cardsCount");
    totalCards.textContent = `${countCards} Cards`;

    //Change img for your shiny version
    const imgPoke = pokeCard.querySelector(".imgPoke");
    imgPoke.addEventListener("click", async () => {
      if (imgPoke.src === pokemon.sprites.front_shiny) {
        imgPoke.classList.toggle("flipped");
        setTimeout(() => {
          imgPoke.src = pokemon.sprites.front_default;
        }, 500); // Change img after 500 ms (0.5 seg)
      } else {
        setTimeout(() => {
          imgPoke.src = pokemon.sprites.front_shiny;
        }, 500);
        imgPoke.classList.toggle("flipped");
      }
    });
  });
};

const getPokemon = async () => {
  try {
    // Get data for API and results its an URL for every pokemon
    pokemons = localStorage.getItem("pokemons"); // Retrieve cached pokemons from local storage
    if (!pokemons) {
      const allPokemon = await fetch(`${url}/pokemon?limit=100000&offset=0`);
      const allPokeData = await allPokemon.json();
    
      const parsedPokemonData = await Promise.all(
        allPokeData.results.map(async (p) => {
          const urlPokemon = await fetch(p.url);
          return urlPokemon.json();
        })
      );

      pokemons = parsedPokemonData.map(
        ({ name, sprites, types, base_experience, id }) => ({
          name,
          sprites: sprites.other[official-artwork],
          types,
          base_experience,
          id,
        })
      );

      localStorage.setItem("pokemons", JSON.stringify(pokemons)); // Cache pokemons in local storage
    } else {
      //Get pokes from cache
      pokemons = JSON.parse(pokemons);
    }
    renderCards(pokemons.slice(offset, limit));
  } catch (error) {
    console.error(error)
    alert("Url not found");
  }
};

//Filter Pokemon Cards
const filterByType = async (type = "all", clear = true) => {
  pokemonType = type;
  if (clear) {
    container.innerHTML = "";
    offset = 0;
    limit = 20;
    countCards = 0;
  }
  if (type !== "all") {
    const filteredPokemon = pokemons.filter((pokemon) => {
      return pokemon.types.some((pokemonType) => {
        return pokemonType.type.name === type;
      });
    });
    renderCards(filteredPokemon.slice(offset, limit));
  } else {
    renderCards(pokemons.slice(offset, limit));
  }
};

getPokemon();

const getTypes = async () => {
  const resType = await fetch(`${url}/type`);
  const allTypes = await resType.json();
  typesPokemon = allTypes.results.map((type) => type.name);
  typesPokemon.length = typesPokemon.length - 2;
  renderNav();
};

getTypes();
console.log(pokemons);
const renderNav = () => {
  const navTypes = document.querySelector(".nav");
  typesPokemon.forEach(async (typePokemon) => {
    const capitalizedType = typePokemon.charAt(0).toUpperCase() + typePokemon.slice(1);

    let liType = document.createElement("li");
    liType.className = "navType";
    liType.innerHTML = `
        <a  href="#">${capitalizedType}</a>
      `;
    //Select div container and push cards
    navTypes.appendChild(liType);
  });
  eventNavType();
};

//Get more cards
const btnMore = document.querySelector(".btnMore");
btnMore.addEventListener("click", () => {
  offset += limit;
  limit += limit;
  filterByType(pokemonType, false);
  heartRed();
});

//Get Type pokemon from nav

function eventNavType() {
  const typeList = document.querySelectorAll(".navType");
  typeList.forEach((typeText) => {
    const linkElement = typeText.querySelector("a");

    linkElement.addEventListener("click", (event) => {
      event.preventDefault();
      const type = linkElement.textContent.toLowerCase();

      // Remove the 'activeLink' class from all <li> elements except the selected one
      typeList.forEach((typeText) => {
        const otherLinkElement = typeText.querySelector("a");
        const otherLiElement = typeText;
        if (otherLinkElement !== linkElement) {
          otherLinkElement.classList.remove("activeLink");
          otherLiElement.classList.remove("activeLink");
        }
      });

      // Add the 'activeLink' class to the selected <a> and <li> elements
      linkElement.classList.add("activeLink");
      typeText.classList.add("activeLink");

      filterByType(type);
      heartRed();
    });
  });
}


function heartRed() {
  const heartIcons = document.querySelectorAll(".heart");

  heartIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      icon.classList.toggle("redHeart");
      icon.classList.toggle("far");
      icon.classList.toggle("fas");
    });
  });
}
heartRed();