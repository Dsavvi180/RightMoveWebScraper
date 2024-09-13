#This function is used to retrieve the rate limit of the website's server to determine how many requests can be sent in a short time span before getting blocked
# in order to correctly code the scraper to obey the rate limit when making requests for the array of URLs concurrently

import requests
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter
from time import time
from concurrent.futures import ThreadPoolExecutor

# URL of the website you want to send the request to
url = 'https://lamp.neb.com/#!/'

# Function to make the GET request
def make_request(url):
    try:
        # Setup retries with backoff factor
        session = requests.Session()
        retry = Retry(
            total=5, 
            backoff_factor=1, 
            status_forcelist=[429, 500, 502, 503, 504]
        )
        adapter = HTTPAdapter(max_retries=retry)
        session.mount('http://', adapter)
        session.mount('https://', adapter)

        # Add headers to the request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        # Perform the GET request with a timeout
        response = session.get(url, headers=headers, timeout=20)
        
        return response.status_code
    except requests.exceptions.RequestException as e:
        print('An error occurred:', e)



# Call the function
def requestStream(url, threadNumber):
    status_code = make_request(url)
    request_count = 1

    while (status_code!=429):
        if status_code is None:
            print(f"Stopping due to request error after {request_count} requests.")
            break
        if status_code != 200:
            print(f"Request {request_count}: Received status code {status_code}")
        else:
            print(f"Thread {threadNumber}: Request {request_count}: Success")
        status_code = make_request(url)
        request_count+=1
        
    else: 
        print("Rate limit reached, IP probably blocked: ", request_count, " requests made.")
        return [status_code, request_count]

    


def concurrentExecution(max_threads):
    pool = ThreadPoolExecutor(max_threads) # 8 = Max Threads for Apple M2 Silicon 
    futures = [] #Futures are tasks submitted to the executor which in this case is pool
    for thread in range(max_threads):
        future = pool.submit(requestStream, url, thread)
        futures.append(future)
    return futures

def rateLimitCount(futures):
    isFinished = False
    startTime = time()
    while(not isFinished):
          allFuturesComplete = all(future.done() for future in futures)
          if (allFuturesComplete):
              isFinished = True
    if isFinished:
        rateLimit = 0
        for future in futures:
            rateLimit += future.result()[1]
        endTime = time()
        timeTaken = endTime - startTime
        print(f"Total requests made before rate limits reached: {rateLimit}. Time taken to process {rateLimit} requests was {timeTaken:.2f} seconds. ")

#Alternative approach
# def rateLimitCount(futures):
#     total_requests = 0
#     for future in as_completed(futures):
#         total_requests += future.result()
#     print(f"Total requests made before rate limits reached: {total_requests}")
  

rateLimitCount(concurrentExecution(7))