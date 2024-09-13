# RightMove Web Scraper

This web scraper is designed to intake a URL for RightMove once a filter for specific criteria, such as area and price, has been applied.

## Features

- The webscraper navigates through approximately 300 pages, in stages, to retrieve the required data.
- The data retrieved includes: property description, key features, price, sale history, and nearby sales.
- **Web scraping is done in JavaScript**, while **concurrency and data processing are handled in Python**.

## Universal Functions

- **delay(action)**: This function takes a string as an argument to indicate that a random amount of time is waited before performing the action indicated by the string argument.
- **rejectCookies**: This function is used to reject the cookies popup, which appears when the website is initially loaded.

## Stage 1: URL Collection

- Stage 1 navigates to the initial input URL and retrieves the hrefs for every property in the search results, requiring pagination through several pages.
- The scraper is dynamic and **stops** when it reaches the **last page** of the search results.
- The main function of this stage is to retrieve an array of hrefs for each property in the search results.

## Stage 2: Data Processing for Each Property

After Stage 1 retrieves the property URLs, Stage 2 processes each URL to scrape the necessary data, including:

- **Property Data**: The scraper collects the property's description, key features, price, sale history, and nearby sales.
- **Pagination**: For each property, the scraper paginates through up to 3 pages if additional information is present.

## Stage 3: Concurrency and Control Center Integration

**Stage 3** handles the **concurrency** and brings together all stages of the scraping process. The `ControlCenter.py` script is responsible for:

- **Managing Threads**: Stage 3 performs asynchronous and concurrent execution by splitting the URLs across threads using a **round-robin algorithm**.
  - Each thread runs one instance of **Chrome Driver**.
  - The URLs are processed by each thread **in series**.
- **Workflow Control**: It orchestrates Stage 1 to collect the property URLs and Stage 2 to process them.
- **Concurrency Management**: By dividing the workload across threads, it ensures efficient data processing for large datasets.
- **Error Handling**: The Control Center script manages errors that may occur during the scraping process and ensures the data is retrieved without interruptions.

### Performance Considerations
Due to the concurrent nature of Stage 3, the CPU and memory requirements are intensive. It is recommended to run this scraper on a machine with at least **32-64GB of RAM** for efficient performance.

## System Requirements

- **32-64GB of RAM** is recommended due to the heavy resource demands of concurrent scraping.
- Multi-core CPU to manage multiple Chrome Driver instances and threads efficiently.

## Potential Deprecation Warning

**Note**: The RightMove website may undergo updates, changes in structure, or the addition of new security features. This could result in elements such as page layouts, tags, or interactions being modified. If this happens, the web scraper may no longer function as intended without updates to the codebase to accommodate the site's changes. It is recommended to periodically review the functionality of the scraper to ensure compatibility with the latest version of the RightMove website.
