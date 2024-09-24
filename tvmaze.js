"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");
const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";
const baseURLTV = "https://api.tvmaze.com";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

  async function getShowsByTerm(term) {

    const response = await axios({
      // craft response
      baseURL:baseURLTV,
      url: "search/shows",
      method: "GET",
      params: {
        q:term,
      },

    });

    // array of show objects is response.data

  return response.data.map(result => {

    const show = result.show;

    console.log(result.show);

    return {id: show.id, name: show.name, summary:show.summary, image: show.image ? show.image.medium: MISSING_IMAGE_URL};
  
});

}

    // expected output, 
    
    // obj
    // {id:id, name:name, summary:summary, image:image};
  
  // ADD: Remove placeholder & make request to TVMaze search shows API.


/** Given list of shows, create markup for each and add to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {

    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
        <img src="${show.image}" alt="${show.name}" class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id){   

  // map axios response to an object

  const response = await axios({
    // craft response
    baseURL:baseURLTV,
    url: `shows/${id}/episodes`,
    method: "GET",
 });

 return response.data.map(episode => ({

  id: episode.id,
  name: episode.name,
  season: episode.season,
  number: episode.number,
}));
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 

  $episodesList.empty();

  for (let episode of episodes){

// episodes is an Array, items are fed into the function and each will be appended to the episodes list

// create li for each episode 

const $episodeLI = $(
  `<li>
     ${episode.name}
     (season ${episode.season}, episode ${episode.number})
   </li>
  `);
  $episodesList.append($episodeLI);
};
$episodesArea.show();
}

async function getEpisodesandDisplay(evt){

  const showId = $(evt.target).closest(".Show").data("show-id");

  const episodes = await getEpisodesOfShow(showId);
  
  populateEpisodes(episodes);
}
// on click event for episodes button, when clicked it takes you to episodes page with list

// .on( "click" [, eventData ], handler )

$showsList.on("click", ".Show-getEpisodes", getEpisodesandDisplay)