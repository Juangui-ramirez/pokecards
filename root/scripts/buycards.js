let url = "https://pokeapi.co/api/v2";
let offset = 0;
let limit = 20;
let countCards = 0;
// let type = "";
let pokemons = [];
const container = document.querySelector(".grid-container");

const renderCards = (pokemons) => {
  pokemons.forEach(async (pokemon) => {
    const urlPokemon = await fetch(pokemon.url);
    const dataPokemon = await urlPokemon.json();

    //Create card Pokemon
    let pokeCard = document.createElement("div");
    pokeCard.className = "pokeCard";
    pokeCard.innerHTML = `
          <div class = "headerCard">
              <p>${dataPokemon.name}</p>
              <i class = "fa-sharp fa-regular fa-heart"></i>
          </div>
          <img class = "imgPoke" src = "${dataPokemon.sprites.other["home"].front_default}">
          <div class = "footerCard">
              <p>Exp ${dataPokemon.base_experience}</p>
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
      if (imgPoke.src === dataPokemon.sprites.other["home"].front_shiny) {
        imgPoke.classList.toggle("flipped");
        setTimeout(() => {
          imgPoke.src = dataPokemon.sprites.other["home"].front_default;
        }, 500); // Change img after 500 ms (0.5 seg)
      } else {
        setTimeout(() => {
          imgPoke.src = dataPokemon.sprites.other["home"].front_shiny;
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
          // return dataPokemon.results
        })
      );

      pokemons = parsedPokemonData.map(
        ({ name, sprites, types, base_experience }) => ({
          name,
          sprites: sprites.other.home,
          types,
          base_experience,
        })
      );

      console.log(pokemons);
      localStorage.setItem("pokemons", JSON.stringify(pokemons)); // Cache pokemons in local storage
    } else {
      //Get pkes from cache
      pokemons = JSON.parse(pokemons);
    }
    renderCards(pokemons.slice(offset, limit));
  } catch (error) {
    console.log(error);
    alert("Url not found");
  }
};

//Filter Pokemon Cards

const filterByType = async (type) => {
  container.innerHTML = "";
  offset = 0;
  limit = 20;
  countCards = 0;
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

//Get more cards
const btnMore = document.querySelector(".btnMore");
btnMore.addEventListener("click", () => {
  offset += limit;
  limit += limit;

  renderCards(pokemons.slice(offset, limit));
});

const typeList = document.querySelectorAll(".navType");

typeList.forEach((typeText) => {
  typeText.addEventListener("click", (event) => {
    event.preventDefault();
    const type = typeText.textContent.toLowerCase();
    filterByType(type);
  });
});
