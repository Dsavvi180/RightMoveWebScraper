from time import time
from concurrent.futures import ThreadPoolExecutor
from asyncIO import run
import json

with open("./propertyResultsHrefs.py","r") as file:
    file_content = file.read()
    ArrayOfPropertyHrefs = json.loads(file_content)
def splitHrefs(ArrayOfHrefs, max_threads):
    remainder = len(ArrayOfHrefs) % max_threads
    quotient = len(ArrayOfHrefs) // max_threads
    print(f"Quotient: {quotient} \nRemainder: {remainder}")

    splitPropertyHref = []
    start = 0
    for i in range(max_threads):
        chunk_size = quotient + 1 if i < remainder else quotient
        splitPropertyHref.append(ArrayOfHrefs[start:start + chunk_size])
        start += chunk_size

    print(splitPropertyHref)
    total = sum(len(chunk) for chunk in splitPropertyHref)
    print(f"Total elements: {total}")

    for i in range(0, len(splitPropertyHref)):
        print(f"\n{len(splitPropertyHref[i])}")
       
    
    return splitPropertyHref #Array of Arrays

def concurrentExecution(ArrayOfHrefs,max_threads):
    NestedArrayOfHrefs = splitHrefs(ArrayOfHrefs,max_threads)
    pool = ThreadPoolExecutor(max_threads) # 8 = Max Threads for Apple M2 Silicon 
    futures = [] #Futures are tasks submitted to the executor which in this case is pool
    start = time()
    for thread in range(max_threads):
        future = pool.submit(run, NestedArrayOfHrefs[thread])
        futures.append(future)
    isFinished = False
   
    while(not isFinished):
          allFuturesComplete = all(future.done() for future in futures)
          if (allFuturesComplete):
              isFinished = True
    if isFinished:
        end = time()
        elapsedTime = end-start
        print(f"Web Scraping Complete. Elapsed time: {elapsedTime}")
    
concurrentExecution(ArrayOfPropertyHrefs, 1)