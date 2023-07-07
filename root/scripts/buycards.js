let url = "https://pokeapi.co/api/v2";
let offset = 0;
let limit = 20;
let pokemons = [];
let currentType = "all";

const container = document.querySelector(".grid-container");

//Function that creates cards and render in hmtml
const renderCards = (pokemons) => {
  container.innerHTML = ""; // Clean container before rendering new cards

  //Create card Pokemon
  pokemons.forEach((pokemon) => {
    let pokeCard = document.createElement("div");
    pokeCard.className = "pokeCard";
    pokeCard.innerHTML = `
      <div class="headerCard">
        <p>${pokemon.name}</p>
        <i class="fa-sharp fa-regular fa-heart"></i>
      </div>
      <img class="imgPoke" src="${pokemon.sprites.other["home"].front_default}">
      <div class="footerCard">
        <p>Exp ${pokemon.base_experience}</p>
        <a href="./pokemonDetails.html?pokemon=${pokemon.id}">
          <button class="btnCard">Buy</button>
        </a>
      </div>`;

    //Select div container and push cards
    container.appendChild(pokeCard);

    //Count cards
    const totalCards = document.querySelector(".cardsCount");
    totalCards.textContent = `${pokemons.length} Cards`;

    //Change img for your shiny version
    const imgPoke = pokeCard.querySelector(".imgPoke");
    imgPoke.addEventListener("click", async () => {
      if (imgPoke.src === pokemon.sprites.other["home"].front_shiny) {
        imgPoke.classList.toggle("flipped");
        setTimeout(() => {
          imgPoke.src = pokemon.sprites.other["home"].front_default;
        }, 500);
      } else {
        setTimeout(() => {
          imgPoke.src = pokemon.sprites.other["home"].front_shiny;
        }, 500);
        imgPoke.classList.toggle("flipped");
      }
    });
  });
};

// Get data for API and results its an URL for every pokemon
const getPokemon = async () => {
  try {
    const res = await fetch(`${url}/pokemon?limit=100000&offset=0`);
    const data = await res.json();

    pokemons = data.results.map((pokemon) => ({
      url: pokemon.url,
      name: pokemon.name,
      sprites: {},
      types: [],
      base_experience: 0,
    }));

    await Promise.all(
      pokemons.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const data = await res.json();

        pokemon.sprites = data.sprites;
        pokemon.types = data.types;
        pokemon.base_experience = data.base_experience;
      })
    );

    renderCards(pokemons.slice(offset, limit));
  } catch (error) {
    alert("Url not found");
  }
};

//Get more cards
const loadMoreCards = () => {
  offset += limit;

  if (currentType === "all") {
    renderCards(pokemons.slice(0, offset + limit));
  } else {
    const filteredPokemon = pokemons.filter((pokemon) => {
      return pokemon.types.some((pokemonType) => {
        return pokemonType.type.name === currentType;
      });
    });

    renderCards(filteredPokemon.slice(0, offset + limit));
  }
};

//Filter Pokemon Cards
const filterByType = (type) => {
  offset = 0;
  currentType = type;

  if (type === "all") {
    renderCards(pokemons.slice(0, limit));
  } else {
    const filteredPokemon = pokemons.filter((pokemon) => {
      return pokemon.types.some((pokemonType) => {
        return pokemonType.type.name === type;
      });
    });

    renderCards(filteredPokemon.slice(0, limit));
  }
};

getPokemon();

const btnMore = document.querySelector(".btnMore");
btnMore.addEventListener("click", loadMoreCards);

//Get text from html nav and execute filter
const typeList = document.querySelectorAll(".navType");

typeList.forEach((typeText) => {
  typeText.addEventListener("click", (event) => {
    event.preventDefault();
    const type = typeText.textContent.toLowerCase();
    filterByType(type);
  });
});
