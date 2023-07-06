let url = "https://pokeapi.co/api/v2";
let offset = 0;
let limit = 20;
let countCards = 0;
// let type = "";

const renderCards = (pokemons) => {
  pokemons.forEach(async (pokemon) => {
    // const urlPokemon = await fetch(pokemon.url);
    // const dataPokemon = await urlPokemon.json();

    //Create card Pokemon
    let pokeCard = document.createElement("div");
    pokeCard.className = "pokeCard";
    pokeCard.innerHTML = `
          <div class = "headerCard">
              <p>${pokemon.name}</p>
              <i class = "fa-sharp fa-regular fa-heart"></i>
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
}

let pokemons = [];

const getPokemon = async () => {
  try {
    // Get data for API and results its an URL for every pokemon
    let pokeList;
    const allPokemon = await fetch(`${url}/pokemon?limit=100000&offset=0`);
    const PokeAlldata = await allPokemon.json();
    pokemons = await PokeAlldata.results.map(async (p) => {
      const urlPokemon = await fetch(p.url);
      const dataPokemon = await urlPokemon.json();
      return dataPokemon.results
    })

    console.log(pokemons);
    // renderCards(PokeAlldata.results.slice(0 , 20));
    
    
    //Replace offset for limit
    offset += limit;
  } catch (error) {
    alert("Url not found");
  }
};

getPokemon();

//Get more cards
const btnMore = document.querySelector(".btnMore");
btnMore.addEventListener("click", getPokemon);

const typeList = document.querySelectorAll(".navType");

typeList.forEach((typeText) => {
  typeText.addEventListener("click", (event) => {
    event.preventDefault();
    const type = typeText.textContent.toLowerCase();

  });
});
