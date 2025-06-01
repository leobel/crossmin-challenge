# Design
There are four kinf of objects on the megaverse: `Polyanet, Soloon, Cometh, Space` . All these objects are subclasses of `AstralObject` and implement method: `equal` for comparison, `toLiteral` for printing and `add, delete` for interacting with the API service. They have guard type functions to check if an `AstralObject` is the same type (e.g `isCometh(obj: AstralObject): obj is Cometh`). 

We have a base api service (`ApiService`) handling common endpoint requests like: `getRequest, addRequest, deleteRquest` and a service for each object: `PolyanetService, SoloonService, ComethService` to pass in the corresponding parameters on each case. There is also a `MapService` to return goal and candidate's map. Each request to the API uses a utility function `requestWithRetry` to handle possible "too many requests" responses (status code: 429), it wait (with a backoff) and retry again until limit is reached. 

We uses `RegistryFactory` and utility methods `createAstralObjectMap` and `createAstralObject` to create instances of `AstralObject` from goal and candidate's maps coming from the API response. `Megaverse` class is where we adjust candidate's map based on the goal map. It uses method `build` to receive both maps (instances of `ObjectMap` => `AstralObject[][]`) and return a new map matching the goal iterating through goal map and checking if objects on each cell are equals, then proceed to delete and/or add on candidate's map accordingly. 

>**Note** Since `Space` object doesn't have any property or functionality we've decided to not include coordinates on it so we can use same object, as a singleton, every time it's needed. Same criteria could have been applied to `Polyanet` but it make more sense to create instances for them since we could expect it will have some functionalities or distinctions in the future. 


## Usage

1. Clone the repo
2. add `.env` file on root dir with this structure
```jsx
BASE_URL="https://challenge.crossmint.io/api"
CANDIDATE_ID="your_candidate_id" # use real candidate id
VALID_COMMADS="logo"
```
3. Install dependecies `npm install`
4. Run the code with `npm run dev` (alternatively you can compile the code with `npm run build` then `npm start`)
You'll see something like this:

![Screenshot 2025-05-31 at 12 23 13 PM](https://github.com/user-attachments/assets/60d2d30d-54a3-4e35-b549-3994a7b27905)

## Tests
```jsx
npm test
```
