// fetch user activity 
async function fetchUserActivity(username) {
    const response = await fetch(`https://api.github.com/users/${username}/events`, {
        headers: {
          "User-Agent": "node.js",
        },
    });
    if (!response.ok || response.status !== 200 || response.status === 404) {
        throw new Error(`Failed to fetch user activity: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

function displayUserActivity(events) {
    if (events.length === 0) {
        console.log("No activity found for this user.");
        return;
    }
    console.log(`${events.length} events found for this user.`);
    events.forEach((event) => {
        let action;
        switch (event.type) {
          case "PushEvent":
            const commitCount = event.payload.commits.length;
            action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
            break;
          case "IssuesEvent":
            action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`;
            break;
          case "WatchEvent":
            action = `Starred ${event.repo.name}`;
            break;
          case "ForkEvent":
            action = `Forked ${event.repo.name}`;
            break;
          case "CreateEvent":
            action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
            break;
          default:
            action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
            break;
        }
        console.log(`- ${action}`);
    });
}

// Main CLI logic
const username = process.argv[2];
if (!username) {
  console.error("Please provide a GitHub username.");
  process.exit(1);
}

fetchUserActivity(username).then((events) => {
    displayUserActivity(events);
  }).catch((err) => {
    console.error(err.message);
    process.exit(1);
});
