import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient


client = MongoClient('')
db = client.admin
collection = db.emaildomains

# Scrape the webpage
url = 'https://www.zyxware.com/articles/4344/list-of-fortune-500-companies-and-their-websites'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')


tables = soup.find_all('table')

# Iterate over each table
for table in tables:
    # Find all rows in the table
    rows = table.find_all('tr')
    
    for row in rows:
        # Find all cells in the row
        cells = row.find_all('td')
        
        # Check if the row has at least two cells
        if len(cells) >= 2:
            # Get the text from the second and third cells
            companyname = cells[1].text.strip()
            domain = cells[2].text.strip()
            httpstripped_domain = domain.replace('http://', '').replace('https://', '')
            domain = httpstripped_domain.split('/')[0]
            domain_final = domain.replace('www.', '')
            
            # Print or process the extracted text
            print(companyname, domain_final)
            collection.insert_one({'company_name': companyname.lower(), 'domain': domain_final})
