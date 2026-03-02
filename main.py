from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time


# 2. Initialize the Driver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# 3. Go to a URL
driver.get("https://terraria.fandom.com/wiki/Terraria_Wiki")

# 4. list every a href address on the page
links = driver.find_elements(By.TAG_NAME, "a")

with open("links.txt", "w") as file:
    for link in links:
        href = link.get_attribute("href")
        if href:
            file.write(href + "\n")

time.sleep(3)
