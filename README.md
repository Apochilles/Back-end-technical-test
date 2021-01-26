# Back-end-technical

There are 3 API operations available for 2 popular movie databases of films.

https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/cinemaworld/movies 
https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/filmworld/movies 
### Returns the movies that are available
https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/cinemaworld/movies/{id} 
https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/filmworld/movies/{id}
### Returns the details of a single movie

https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/cinemaworld/movie 
https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/filmworld/movie
### Posts a movie to the endpoint


Exercise


Build a web app to allow customers to get the cheapest price for movies from these two providers in a timely manner.


Design a solution to have a functioning app when not all of the providers are functioning at 100 %.


The goal of the test is to allow you to present your best code that you feel proud off.


Feel free to make and document any assumptions you have made.


The API token created or used should not be exposed to the public.


Export Bulk CSV of all movies for last 24 hours with a queuing mechanism to avoid failure (resilience).



Bonus Point on:

·         AWS platform usage like Lambda Functions and it’s other services to achieve the goal and create Infrastructure as a code to configure AWS through the codebase (Can use free AWS account)

·         Serverless/Terraform or any other (Good to have but optional)

·         Can use NodeJS or PHP (Laravel). — NODE.js preferred

·         Frequent code checkin in git repo

·         Production ready code with basic Unit Testing coverage

·         Best practices and design patterns preferred


NOTE:

·         Intent is to check the problem solving skills, code quality, awareness of technologies & Backend development experiences

·         Avoid spending too much time to make it bug free or fully functional. Usually 2-3 hours are sufficient enough

·         For storing Data, you can use mysql or a JSON file/object whichever saves time

·         A basic frontend will be preferred using boiler plate with 80% focus on Backend

·         FAQ:

o    In regards to API keys and simulating unavailability, it could be difficult to achieve this with a best practise & secure 3rd party auth provider

§  Totally fine. Just mention with comments wherever applicable to let us know your thoughts within the code

o    Will it be a problem if there is a chance that both “cinemaworld” and “filmworld” fail at the same time because of the random simulated downstream failures I hard code?

§  Open to any ideas or approach. Document where ever needed and shall be fine
