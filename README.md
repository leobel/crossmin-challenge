# Design
There are four main classes: `Polyanet, Soloon, Cometh, Space` to represent megaverse objects. All objects are subclasses of `AstralObject` and implement methods: `equal` and `toLiteral` (used for printing). All this objects define guard type functions to check if an `AstralObject` is the same type (e.g `isCometh(obj: AstralObject): obj is Cometh`) .We have a base api service (`ApiService`) handling common endpoint requests like: `get, add, delete` and a service for each object: `PolyanetService, SoloonService, ComethService` to pass in the corresponding parameters on each case. Also there is a `MapService` to return candidate and goal map.

`Megaverse` class is where we adjust candidate's map based on the goal map. Method `build` receive both maps and return a new map matching the goal, it just iterate through goal map and check if objetc on each cell differ from candidates map, then proceed to delete and add on candidate's map accordingly. Methods `mapFromLiteral` and `mapFromObject` helps to convert objects comming from the API to `AstralObject` so we can get access to their properties (e.g `color` or `direction`) and can compare easily.

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
