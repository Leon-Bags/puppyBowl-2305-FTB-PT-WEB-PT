const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2305-FTB-PT-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */

//fetch data from API
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(
            APIURL + 'players'
        );
        const result = await response.json();

        return result.data.players
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

//add new player data from API
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(
            APIURL + 'players',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: playerObj.name,
                    breed: playerObj.breed,
                }),
            }
        )
        /* const result = await response.json();
         // await, withhold data till response is achieved.
         return result.data */
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};
//delete player data from API
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(
            APIURL + 'players/' + playerId,
            {
                method: 'DELETE',
            }
        );
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param _playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

//Render the All players form
const renderAllPlayers = (players) => {
    try {
        playerContainer.innerHTML = "";
        players.forEach((player) => {
            const playerElement = document.createElement("div");
            playerElement.classList.add("player-card");
            playerElement.innerHTML = `
            <p class="id-tag">#${player.id}</p>
            <h2 class="name-tag">${player.name}</h2>
            <p>Breed: ${player.breed}</p>
            <p>Status: ${player.status}</p>
            <div class="image-container">
            <img src="${player.imageUrl}" alt="${player.name}'s picture is missing!"/>
            </div>
            <button class="details-button" data-id="${player.id}">See Details</button>
            <button class="delete-button" data-id="${player.id}">Delete Player</button>
            `;
            playerContainer.appendChild(playerElement);

            // See Details
            const detailsButton = playerElement.querySelector(".details-button");
            detailsButton.addEventListener("click", async (event) => {
                event.preventDefault();
                renderSinglePlayerById(player.id);
            });

            // Delete Puppy
            const deleteButton = playerElement.querySelector(".delete-button");
            deleteButton.addEventListener("click", (event) => {
                event.preventDefault();
                removePlayer(player.id)
            });
        })
    } catch (error) {
        console.error('Uh oh, trouble rendering players!', error);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */

//render the new player form
const renderNewPlayerForm = () => {
    try {
        newPlayerFormContainer.innerHTML = `
        <h2 id="form-title">Submit a new Player!</h2>
        <form action="" id="userForm">
        
        <label class="label" for="name">Name of the Puppy?* :</label>
        <input type="text" id="player-name" class="input-field" required/>
        
        <label class="label" for="breed">What Kind of Dog?* :</label>
        <input type="text" id="player-breed" class="input-field" required/>
        
        <label class="label" for="Status">Field or Bench?*  :</label>
        <input type="text" id="player-status" class="input-field" required/>
        
        <label class="label" for="imageUrl">URL Link To A Picture? :</label>
        <input type="url" id="player-image" class="input-field" />

        <p class="required">"*" = Required Input</p>
        
        <button class="sub-button">Submit!</button>
        </form>
        `;

        // Event listener
        const submitButton = document.querySelector('.sub-button');
        submitButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const name = document.getElementById('player-name').value;
            const breed = document.getElementById('player-breed').value;
            const status = document.getElementById('player-status').value.toLowerCase();
            const imageUrl = document.getElementById('player-image').value;

            let playerObj = {
                name: name,
                breed: breed,
                status: status,
                imageUrl: imageUrl,
            };

            // Create a new party
            try {
                await addNewPlayer(playerObj);

                // Clear the form after successful submission
                document.getElementById("userForm").reset();

                // Fetch and render all parties again to include the newly created party
                const data = await fetchAllPlayers();
                renderAllPlayers(data.players);
            }
            catch (error) {
                console.error("Failed to submit a new party", error);
            }
        });
    } catch (error) {
        console.error('Uh oh, trouble rendering the new player form!', error);
    }
};

// Initialise the page
const init = async () => {
    renderNewPlayerForm();
    const data = await fetchAllPlayers();
    renderAllPlayers(data);
};
init();