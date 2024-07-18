import asyncio
from pythonExecution import pythonExecution
import re
import json

# URLS = [
#   'https://www.rightmove.co.uk/properties/86811990#/?channel=RES_BUY',
#   'https://www.rightmove.co.uk/properties/145978913#/?channel=RES_BUY',
#   'https://www.rightmove.co.uk/properties/110893463#/?channel=RES_BUY',
#   'https://www.rightmove.co.uk/properties/148920611#/?channel=RES_BUY',
#   'https://www.rightmove.co.uk/properties/146347433#/?channel=RES_BUY',
#   'https://www.rightmove.co.uk/properties/148682738#/?channel=RES_BUY',
#   'https://www.rightmove.co.uk/properties/148819535#/?channel=RES_BUY',]

async def main(URLS):
    tasks = [asyncio.create_task(pythonExecution(url)) for url in URLS] #asyncio.gather() throws tasks onto
    #event loop and then waits to receive them back, but using asyncio.create_task() we can throw the tasks
    #onto the event loop sooner so that asyncio.gather() just waits to receive them.
    results = await asyncio.gather(*tasks) #dereferences list, passes in every element of tasks as a param
    propertyData = []
    for result in results:
        propertyData.append(result)
    return results

def run(URLS):
    coroutines = asyncio.run(main(URLS))
    for i in coroutines:
        print(i,"\n")
    print("\n\n\n********* NB FINAL OUPUT *******\n\n\n")
    print(coroutines)
    property_data_objects = []
    for i in coroutines:
        pattern = r'PROPERTY DATA OBJECT= ({.*?})'
        matches = re.findall(pattern,i, re.DOTALL)
        for match in matches:
            try:
                json_string = match.replace("'", '"')  # Ensure correct JSON format
                 # Ensure the JSON object is properly closed
                if not json_string.endswith('}'):
                    json_string += '}'
                
                print(f"Attempting to load JSON: {json_string}")
                property_data_objects.append(json.loads(json_string))
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {e}")
                print(f"Problematic string: {json_string}")
        with open('property_data.json', 'w') as json_file:
            json.dump(property_data_objects,json_file, indent=2)

if __name__ == "__main__":
   run()