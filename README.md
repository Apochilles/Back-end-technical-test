# Back-end-technical

### There are 3 API operations available for 2 popular movie databases of films.

### Returns the movies that are available
- https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/cinemaworld/movies 
- https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/filmworld/movies 
### Returns the details of a single movie
- https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/cinemaworld/movies/{id} 
- https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/filmworld/movies/{id}
### Posts a movie to the endpoint
- https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/cinemaworld/movie 
- https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/filmworld/movie


## Exercise


### Build a web app to allow customers to get the cheapest price for movies from these two providers in a timely manner.

https://unruffled-villani-204af6.netlify.app/

### Design a solution to have a functioning app when not all of the providers are functioning at 100 %.

My solution is to call both apis simultaneously. If one fails the other will provide a list of movies as a backup. If both fail the user will be notified that the service is down 

### Export Bulk CSV of all movies for last 24 hours with a queuing mechanism to avoid failure (resilience).

I use a Lambda to make a call on both {database} endpoints. I then combine the arrays, convert them to CSV and sent them to an S3 bucket via an SQS queue.

- The goal of the test is to allow you to present your best code that you feel proud off.
- Feel free to make and document any assumptions you have made.
- The API token created or used should not be exposed to the public.



## Bonus Points on:

####  AWS platform usage like Lambda Functions and it’s other services to achieve the goal and create Infrastructure as a code to configure AWS through the codebase (Can use free AWS account)

My entire back end is hosted in AWS on Lambdas. For a queuing mechanism I use SQS and the for the exported CSV I use an S3 bucket. For authentication I used IAM and plan to implement Cognito is the future 

####   Serverless/Terraform or any other (Good to have but optional)

My entire backend uses Serverless as SAAS.

####  Can use NodeJS or PHP (Laravel). — NODE.js preferred

I use Node for every aspect of this project. 

####  Frequent code checkin in git repo

I check in regualrly and with meaningful commit names.

####  Production ready code with basic Unit Testing coverage

Code is nearly production ready but I didn't find time to unit test my application.

####  Best practices and design patterns preferred

I tried my best to implement simple and effective API design. For my code I strived for it to be as simple to intepret as possible and kept code comments to a minimum. I tried for a dry aproach to code, reusing my functions when applicable. 

NOTE:

- Intent is to check the problem solving skills, code quality, awareness of technologies & Backend development experiences

- Avoid spending too much time to make it bug free or fully functional. Usually 2-3 hours are sufficient enough

- For storing Data, you can use mysql or a JSON file/object whichever saves time

- A basic frontend will be preferred using boiler plate with 80% focus on Backend

##         FAQ:

-    In regards to API keys and simulating unavailability, it could be difficult to achieve this with a best practise & secure 3rd party auth provider

  Totally fine. Just mention with comments wherever applicable to let us know your thoughts within the code

-    Will it be a problem if there is a chance that both “cinemaworld” and “filmworld” fail at the same time because of the random simulated downstream failures I hard code?

  Open to any ideas or approach. Document where ever needed and shall be fine
