import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import ssl

# Connect to MongoDB
client = MongoClient('mongodb+srv://doadmin:78q1Aj0px6352kcm@db-mongodb-nyc1-51418-f4c19a18.mongo.ondigitalocean.com/admin?tls=true&authSource=admin', ssl_cert_reqs=ssl.CERT_NONE)

db = client['admin']
collection = db['emaildomains']

# Make a GET request to the webpage
url = 'https://www.zyxware.com/articles/4344/list-of-fortune-500-companies-and-their-websites'
response = requests.get(url)

# Parse the HTML content
soup = BeautifulSoup(response.content, 'html.parser')

# Find all table elements
tables = soup.find_all('table')

# Loop through each table
for table in tables:
    # Loop through the table rows (excluding the header row)
    for row in table.find_all('tr')[1:]:
        tds = row.find_all('td')
        domain = tds[2].text.strip().lower()
        domain = domain.lstrip('http://').lstrip('https://').lstrip('www.').rstrip('/')
        companyname = tds[1].text.strip().lower()

        # Create a document to be inserted in MongoDB
        data = {
            'company_name': companyname,
            'domain': domain
        }

        # Insert the document into the MongoDB collection
        collection.insert_one(data)
        break
