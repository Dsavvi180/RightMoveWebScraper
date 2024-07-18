# import asyncio
# import os
# import time
# async def pythonExecution(propertyURL):
#     # Define the path to your JavaScript project directory
#     js_project_path = '/Users/damensavvasavvi/Desktop/Coding-Projects/RightMoveWebScraper/test/functions/StageTwo'

#     # Define the entry JavaScript file
#     entry_file = os.path.join(js_project_path, 'inspectIndividualProperty.js')

#     # Execute the JavaScript file using Node.js
#     process = await asyncio.create_subprocess_exec(
#         'node', entry_file, propertyURL, 
#         stdout=asyncio.subprocess.PIPE,
#         stderr=asyncio.subprocess.PIPE
#     )
#     await asyncio.sleep(1)
#     stdout, stderr = await process.communicate()

#     # Print the result
#     print("Python Execution:", stdout.decode())
#     if stderr:
#         print("Python Execution Errors:", stderr.decode())
    

#     return stderr #Hopefully return propertyData object from inspectIndividualProperty

# URL = 'https://www.rightmove.co.uk/properties/86811990#/?channel=RES_BUY'

# async def main():
#     coroutine = await pythonExecution(URL)
#     print(coroutine)

# if __name__ == "__main__":
#     asyncio.run(main())
import asyncio
import subprocess
import os
import time
import json
import re

async def pythonExecution(propertyURL):
    # Define the path to your JavaScript project directory
    js_project_path = '/Users/damensavvasavvi/Desktop/Coding-Projects/RightMoveWebScraper/test/functions/StageTwo'

    # Define the entry JavaScript file
    entry_file = os.path.join(js_project_path, 'inspectIndividualProperty.js')

    # Execute the JavaScript file using Node.js
    process = await asyncio.create_subprocess_exec(
        'node', entry_file, propertyURL,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
   
    result = await process.stdout.read()
    await process.wait()
    # print(result.decode())
    return result.decode() #converts from bytes object to String
    # try:
    #     stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=35)
        
    #     return stdout
    # except asyncio.TimeoutError:
    #     process.kill()
    #     stdout, stderr = await process.communicate()
    #     print("Python Execution Error: Timeout expired")

    # if stderr:
    #     print("Python Execution stderr:", stderr.decode())
    #     return stderr.decode()

    # return stdout.decode()# Hopefully return propertyData object from inspectIndividualProperty

URL = 'https://www.rightmove.co.uk/properties/146347433#/?channel=RES_BUY'

def main():
    # loop = asyncio.get_event_loop()
    # result = loop.run_until_complete(pythonExecution(URL))
    # loop.close()
    # The above can be abstracted to asyncio.run()
    result = asyncio.run(pythonExecution(URL))
    if "PROPERTY DATA OBJECT=" in result:
        propertyData = result.split("PROPERTY DATA OBJECT=")[1].strip()
        print("Property Data Object",propertyData)
        return propertyData
    else:
        print("NO DATA OBJECT FOUND: ",result)
        return None

if __name__ == "__main__":
    try:
       main()
       
    except:
        print("main() function has not suitable returned content.")
      
