# RightMove Web Scraper

This web scraper is designed to intake a URL for RightMove once a filter for specific criteria, such as area and price, has been applied.

## Points:

- The webscraper navigates through approximately 300 pages, in stages, to retrieve the required data.
- The data retrieved is generic and requires further analysis, but includes: description, key features, price, sale history, and nearby sales.

## Universal functions:

- These functions are functions that are used throughout the code base to perform common actions and include:
  - **delay(action)**: this function takes a string as an argument to indicate that a random amount of time is waited before performing the action indicated by the String argument.
  - **rejectCookies:** this function is used to reject the cookies popup which is initially rendered as the website is loaded.

## Stage 1:

- **Stage 1** navigates to the initial inputted URL and retrieves the hrefs for every property in the search results, which requires pagination through several pages.
- The code is dynamic and **stops** when a conditional is true to indicate the scraper is on the **last page** of the search results.
- The function **'getAllResults'** is the main function for this stage, which makes use of helper functions, and returns an array of hrefs for each property in the search results.
- These **helper functions** include: collectAllPropertyIDs, collectHrefs.
