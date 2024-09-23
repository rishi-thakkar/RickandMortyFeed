# Rick and Morty Characters Feed

To run this project clone the repository and run the following commands:

```bash
npm install
npm run dev
```

## Approach
I used React Hooks to fetch and filter/sort the data from the API and then styled the data using Ant Design components. 

## Challenges
A challenge I faced while building this project was performance. Initially all the data was fetched from the API at once on page load. This caused performance issues and filtering/sorting became slow. As a solution I implmeneted pagination and used the useMemo hook for caching. Both these improvments resulted in a significant performance improvement.