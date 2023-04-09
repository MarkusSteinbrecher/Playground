const fs = require('fs');
const https = require('https');

// Define the repository to query
const owner = 'MarkusSteinbrecher';
const repo = 'Playground';

// Define the API endpoint
const url = `https://api.github.com/repos/${owner}/${repo}`;

// Set headers to include user agent for GitHub API
const headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/vnd.github.v3+json'
};

// Send a GET request to the API endpoint
https.get(url, { headers }, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        // Extract the data from the response
        const json = JSON.parse(data);

        // Write the data to a JSON file
        fs.writeFile('repo_info.json', JSON.stringify(json, null, 4), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    });
}).on('error', (err) => {
    console.log(`Error: ${err.message}`);
});
