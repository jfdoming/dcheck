# dcheck
Hey UWaterloo students! Have you ever noticed that there's no easy way to know when a course is usually offered? You can manually search the course calendar, sure, but this is time consuming. What if there was an easier way to look up a course? Introducing dcheck.

## How to run
Assuming you have the package manager [npm](https://www.npmjs.com/) installed, the easiest way to get started is to run the command `npm start` from within the repository.

## Troubleshooting
### Help! My course doesn't show up when I enter it!
That's OK! Altough dcheck currently does not have a complete list of all courses offered at UWaterloo, you can still enter a course code you know exists and dcheck will return the results to you.

### I'm trying to run this without using npm and it's not working.
Unfortunately, dcheck relies on being able to communicate with the UWaterloo web servers, which means that it needs to be running on a (proxied) server itself. 