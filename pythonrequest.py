import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from collections import deque

def recursive_scrape(start_url, max_depth=2, visited=None):
    """
    Recursively scrape a website up to a maximum depth.
    
    Args:
        start_url: The starting URL to scrape
        max_depth: Maximum recursion depth
        visited: Set of already visited URLs
    """
    if visited is None:
        visited = set()
    
    if max_depth == 0 or start_url in visited:
        return
    
    visited.add(start_url)
    
    try:
        response = requests.get(start_url, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print(f"Scraping: {start_url}")
        
        # Extract data (example: titles)
        title = soup.title.string if soup.title else "No title"
        print(f"Title: {title}\n")
        
        # Find all links and recurse
        for link in soup.find_all('a', href=True):
            url = urljoin(start_url, link['href'])
            # Only follow links from same domain
            if urlparse(url).netloc == urlparse(start_url).netloc:
                if url not in visited:
                    recursive_scrape(url, max_depth - 1, visited)
    
    except Exception as e:
        print(f"Error scraping {start_url}: {e}")

# Example usage
if __name__ == "__main__":
    recursive_scrape("https://1cak.com", max_depth=2)