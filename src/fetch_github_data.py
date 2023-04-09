import requests
import json

owner = 'MarkusSteinbrecher'

headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/vnd.github.v3+json'
}

def fetch_data(url):
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f'Error: {response.status_code} - {response.text}')
        return None

user_data = fetch_data(f'https://api.github.com/users/{owner}')
repos_data = fetch_data(f'https://api.github.com/users/{owner}/repos')

if user_data and repos_data:
    # Get total stars
    total_stars = sum([repo['stargazers_count'] for repo in repos_data])

    # Collect commit information
    commits = {}
    for repo in repos_data:
        repo_name = repo['name']
        commit_data = fetch_data(f'https://api.github.com/repos/{owner}/{repo_name}/commits')
        if commit_data:
            commits[repo_name] = len(commit_data)

    # Combine all data
    combined_data = {
        'user_data': user_data,
        'repos_data': repos_data,
        'total_stars': total_stars,
        'commits': commits
    }

    # Write data to JSON file
    with open('user_info.json', 'w') as f:
        json.dump(combined_data, f, indent=4)

    print('Data written to file')
