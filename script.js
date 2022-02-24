// Tjekker om DOM'en er loaded før siden vises
window.addEventListener("DOMContentLoaded", start);
function start() {
  console.log("start");

  // Definerer stien til json-array fra restdb i stedet for lokal .json-fil
  // Henter 2 collections fra samme database
  const url = "https://passion-410f.restdb.io/rest/musikere";
  const url2 = "https://passion-410f.restdb.io/rest/omos";
  const key = "620e21bb34fd621565858704";
  const options = {
    headers: {
      "x-apikey": key,
    },
  };
  // definere globale variable
  const main = document.querySelector("main");
  const section = document.querySelector(".infoBoks");
  const template = document.querySelector(".loopview").content;
  const template2 = document.querySelector(".bloggerBoks").content;
  const popup = document.querySelector("#popup");
  const article = document.querySelector("article");
  const lukKnap = document.querySelector("#luk");
  const header = document.querySelector("h1");

  let bloggere;
  let artister;
  let filter = "alle";

  // Lytter efter "klik" på menu-knap til burgermenu
  document.querySelector("#menuknap").addEventListener("click", toggleMenu);

  // Toggler klassen "hidden" hver gang der klikkes på menu-knappen
  function toggleMenu() {
    console.log("toggleMenu");
    document.querySelector("#menu").classList.toggle("hidden");

    let erSkjult = document.querySelector("#menu").classList.contains("hidden");

    // Ændre menu-knappens "udseende" alt efter om burgermenuen er skjult eller ej
    if (erSkjult == true) {
      document.querySelector("#menuknap").textContent = "☰";
    } else {
      document.querySelector("#menuknap").textContent = "X";
    }
  }

  const filterKnapper = document.querySelectorAll(".nav button");

  const filterKnapperBurger = document.querySelectorAll("#menu button");

  //  sætter eventlistener på alle knapper i burgermenu og lytter efter klik på knapperne
  filterKnapperBurger.forEach((knap) =>
    knap.addEventListener("click", filtrerInfluencer)
  );

  // sætter eventlistener på alle knapper i nav'en og lytter efter klik på knapperne
  filterKnapper.forEach((knap) =>
    knap.addEventListener("click", filtrerInfluencer)
  );

  // sætter filter til at være ligmed den data-attribut vi har defineret i HTML; Markus, Sandra, Filippa eller Dino
  function filtrerInfluencer() {
    console.log("filtrerInfluencer");
    filter = this.dataset.influencer;

    // fjerner klassen .valgt og lægger den til den knap der er trykket på
    document.querySelector(".valgt").classList.remove("valgt");
    this.classList.add("valgt");
    visArtister();
    visBloggere();

    // jeg sætter h1'erens tekstindhold ligmed tekstindholdet af den knap der er trykket på
    header.textContent = this.textContent;
  }

  // Henter json-data fra restdb via fetch() fra to forskellige collections i samme database
  async function hentData() {
    const respons = await fetch(url, options);
    const respons2 = await fetch(url2, options);
    artister = await respons.json();
    bloggere = await respons2.json();
    console.log("Artister", artister);
    console.log("Bloggere", bloggere);
    visArtister();
    visBloggere();
  }

  function visBloggere() {
    console.log("visBloggere");

    section.textContent = ""; // Her resetter jeg DOM'en ved at tilføje en tom string

    // for hver blogger i arrayet, skal der tjekkes om de opfylder filter-kravet og derefter vises i DOM'en.
    bloggere.forEach((blogger) => {
      if (filter == blogger.influencer) {
        document.querySelector(".tekstOmAlle p").textContent = "";
        const klon2 = template2.cloneNode(true);
        klon2.querySelector(".bloggerBillede").src =
          "img/" + blogger.billede2 + ".jpg";
        klon2.querySelector(".bloggerTekst").textContent = blogger.omos;

        // tilføjer klon-template-elementet til section-elementet (så det hele vises i DOM'en)
        section.appendChild(klon2);
        // tilføjer section-elementet til min "header" der har klassen .splash
        document.querySelector(".splash").appendChild(section);
      }
      // Hvis filteret er sat til alle, indsættes denne tekst
      else if (filter == "alle") {
        document.querySelector(".tekstOmAlle p").textContent =
          "Fire af landets mest etablerede musikbloggere fra hovedstaden peger på deres 2022 favoritter. Se deres nøje udvalgte bands og artister, og læs hvorfor netop disse kunstnere kommer til at blinke på stjernehimlen i det nye år. Bliv inspireret af både etablerede og nye acts, som forhåbentligt leverer flere hits i 2022.";
      }
    });
  }

  // loop'er gennem alle artister i json-arrayet
  function visArtister() {
    console.log("visArtister");

    main.textContent = ""; // Her resetter jeg DOM'en ved at tilføje en tom string

    // for hver artist i arrayet, skal der tjekkes om de opfylder filter-kravet og derefter vises i DOM'en.
    artister.forEach((artist) => {
      if (filter == artist.influencer || filter == "alle") {
        const klon = template.cloneNode(true);
        klon.querySelector(".billede").src = "img/" + artist.billede + ".png";
        klon.querySelector(".navn").textContent = artist.navn;
        klon.querySelector(".korttekst").textContent = artist.kort_beskrivelse;
        klon.querySelector(".genre").textContent = "Genre: " + artist.genre;
        // tilføjer eventlistner til hvert article-element og lytter efter klik på artiklerne. Funktionen "visDetaljer" bliver kaldt ved klik.
        klon
          .querySelector("article")
          .addEventListener("click", () => visDetaljer(artist));

        // tilføjer klon-template-elementet til main-elementet (så det hele vises i DOM'en)
        main.appendChild(klon);
      }
    });
  }

  // tilføjer objekter fra arrayet (for hver artist) til popup-vindue. Samt sætter cursor til default, så man ikke tror man kan klikke på elementet igen.
  function visDetaljer(artist) {
    console.log(artist);
    document.querySelector(".nav").style.position = "inherit";
    article.style.cursor = "default";
    popup.style.display = "block";
    popup.querySelector(".billede").src = "img/" + artist.billede + ".png";
    popup.querySelector(".billede").style.maxWidth = "50%";
    popup.querySelector("iframe").src = artist.lyd;
    popup.querySelector(".navn").textContent = artist.navn;
    popup.querySelector(".langtekst").textContent = artist.lang_beskrivelse;
    popup.querySelector(".udvalgt").textContent = "Lyt til: " + artist.udvalgt;
    popup.querySelector(".influencer").textContent =
      "Udvalgt af " + artist.influencer;
  }

  // ved klik på luk-knappen forsvinder popup-vindue
  lukKnap.addEventListener("click", () => (popup.style.display = "none"));
  lukKnap.addEventListener(
    "click",
    () => (document.querySelector(".nav").style.position = "sticky")
  );
  hentData();
}
