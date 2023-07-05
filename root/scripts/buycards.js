let url = "https://pokeapi.co/api/v2";
let offset = 0;
let limit = 20;
let countCards = 0;

//Function that creates pokemon cards with their info
const getPokemon = async () => {
  try {
    // Get data for API and results its an URL for every pokemon
    const res = await fetch(`${url}/pokemon?offset=${offset}&limit=${limit}`);
    const data = await res.json();

    //Get all data for every pokemon
    data.results.forEach(async (pokemon) => {
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
      const container = document.querySelector(".grid-container");
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
