import requests
import json
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate(
    "./what-is-in-my-fridge-d17be-firebase-adminsdk-t51ko-7d07b06fbc.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
collection = db.collection('recipies')
while True:
    URL = input("Enter URL")
    r = requests.get(URL)
    soup = BeautifulSoup(r.content, 'html5lib')
    title = soup.find('h1', attrs={'class': 'entry-title'}).text
    require = (list(map(lambda x: x.text, soup.findAll(
        'span', attrs={'class': 'wprm-recipe-ingredient-name'}))))
    obj = {
        "name": title,
        "url": URL,
        "require": require
    }
    print(json.dumps(obj, indent=4))
    choice = input("Write to Firestore: Y/N")
    if choice == "Y" or choice == "y":
        collection.add(obj)
        print("Added to Firestore")
    print("Keyboard Intrupt to stop")
    print("===================================")
