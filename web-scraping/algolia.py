import os
import time
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def setup_driver():
    options = webdriver.ChromeOptions()
    options.binary_location = "./chromedriver.exe"
    driver = webdriver.Chrome(options=options)
    return driver

def wait_for_content(driver, timeout=300):
    try:
        WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="BoardAndMap__section-0"]/div/div'))
        )
        return True
    except Exception as e:
        print(f"Error during wait: {e}")
        return False

def scrape_attractions(driver):
    attraction_elements = driver.find_elements(By.XPATH, '//*[@id="BoardAndMap__section-0"]/div/div/div/div/div[2]/div/div[1]/h2/a')
    description_elements = driver.find_elements(By.XPATH, '//*[@id="BoardAndMap__section-0"]/div/div/div/div/div[2]/div/div[2]/div/div[2]')
    
    attractions = []
    for attraction, description in zip(attraction_elements, description_elements):
        attractions.append({
            "name": attraction.text.strip(),
            "description": description.text.strip()
        })
    
    return attractions

def main():
    url = "https://wanderlog.com/list/geoCategory/1587023/top-things-to-do-and-attractions-in-bhaktapur"
    driver = setup_driver()
    if driver is None:
        print("Failed to set up the driver. Exiting.")
        return
    try:
        driver.get(url)
        time.sleep(10)  # Wait for the page to load
        if not wait_for_content(driver):
            print("Content not loaded within the timeout period.")
            return
        attractions = scrape_attractions(driver)
        file_name = "bhaktapur_attractions.csv"
        with open(file_name, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Attraction Name', 'Attraction Description'])
            for attraction in attractions:
                writer.writerow([attraction['name'], attraction['description']])
        print(f"Scraped {len(attractions)} attractions and saved to {file_name}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    main()
