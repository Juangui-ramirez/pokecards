document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get("pokemon");
  const pokemons = JSON.parse(localStorage.getItem("pokemons"));
  const pokemon = pokemons.find((p) => p.id === Number(pokemonId));
  const spriteType =
    "https://raw.githubusercontent.com/msikma/pokesprite/master/misc/type-logos/gen8/";

  console.log(pokemon);

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = "Anonymous";
      img.src = src;
    });

  const loadPokemonDetails = async () => {
    if (pokemon) {
      const detailsContainer = document.querySelector(".container");
      const capitalizedPokemonName =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      const [type1, type2] = pokemon.types.map((typeObj) => typeObj.type.name);

      const colorThief = new ColorThief();
      const imageSrc = pokemon.sprites.front_default;
      const imagePoke = await loadImage(imageSrc);
      const color = `rgb(${colorThief.getColor(imagePoke).join()})`;
      const gradientColor = `repeating-linear-gradient(45deg, ${color}, #ffffff,${color}, #ffffff,${color})`;

      detailsContainer.innerHTML = `
    <div class = "card" style="background-image: ${gradientColor};">
        <div class = "header-card">
            <h1>${capitalizedPokemonName}</h1>
            <p> #${pokemon.id} </p>
        </div>
        <div class = "types">
            <img src = "${spriteType}${type1}.png"></img>
                ${
                  type2
                    ? `<img src="${spriteType}${type2}.png" alt="${type2}"></img>`
                    : ""
                }
        </div>
        <img src="${
          pokemon.sprites.front_default
        }" alt="${capitalizedPokemonName}" class = "imgpoke">
    </div>

    <div class="stat-card" style="background-color: ${color}";>
      <h2>Stats</h2>
      <p>${pokemon.stats[0].stat.name}</p>
      <div class="stat-bar" style="background: linear-gradient(to right, ${mapColor(
        pokemon.stats[0].base_stat
      )} ${getFillPercentage(
        pokemon.stats[0].base_stat
      )}%, #fff ${getFillPercentage(pokemon.stats[0].base_stat)}%);">
            <span>${pokemon.stats[0].base_stat}</span>
          </div>
      <p>${pokemon.stats[1].stat.name}</p>
      <div class="stat-bar" style="background: linear-gradient(to right, ${mapColor(pokemon.stats[1].base_stat)} ${getFillPercentage(pokemon.stats[1].base_stat)}%, #fff ${getFillPercentage(pokemon.stats[1].base_stat)}%);">
      <span>${pokemon.stats[1].base_stat}</span>
    </div>
      <p>${pokemon.stats[2].stat.name}</p>
      <div class="stat-bar" style="background: linear-gradient(to right, ${mapColor(pokemon.stats[2].base_stat)} ${getFillPercentage(pokemon.stats[2].base_stat)}%, #fff ${getFillPercentage(pokemon.stats[2].base_stat)}%);">
      <span>${pokemon.stats[2].base_stat}</span>
    </div>
      <p>${pokemon.stats[3].stat.name}</p>
      <div class="stat-bar" style="background: linear-gradient(to right, ${mapColor(pokemon.stats[3].base_stat)} ${getFillPercentage(pokemon.stats[3].base_stat)}%, #fff ${getFillPercentage(pokemon.stats[3].base_stat)}%);">
      <span>${pokemon.stats[3].base_stat}</span>
    </div>
      <p>${pokemon.stats[4].stat.name}</p>
      <div class="stat-bar" style="background: linear-gradient(to right, ${mapColor(pokemon.stats[4].base_stat)} ${getFillPercentage(pokemon.stats[4].base_stat)}%, #fff ${getFillPercentage(pokemon.stats[4].base_stat)}%);">
      <span>${pokemon.stats[4].base_stat}</span>
    </div>
      <p>${pokemon.stats[5].stat.name}</p>
      <div class="stat-bar" style="background: linear-gradient(to right, ${mapColor(pokemon.stats[5].base_stat)} ${getFillPercentage(pokemon.stats[5].base_stat)}%, #fff ${getFillPercentage(pokemon.stats[5].base_stat)}%);">
      <span>${pokemon.stats[5].base_stat}</span>
    </div>
    </div>
        `;
    } else {
      console.log("Pokemon not found");
    }
  };

  loadPokemonDetails();
});

function getFillPercentage(value) {
  return (value / 255) * 100;
}

function mapColor(statValue) {
  if (statValue >= 60) {
    return "#00FF00";
  } else if (statValue >= 40) {
    return "#FFA500";
  } else {
    return "#FF0000";
  }
};
