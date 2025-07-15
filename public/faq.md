# PrioLab FAQ

## General Questions

### What is PrioLab?
PrioLab is an open-source, community-driven platform designed for issue prioritization and project management. It enables teams to make collaborative decisions through voting mechanisms and transparent prioritization frameworks.

### How does community-driven prioritization work?
Community-driven prioritization involves stakeholders voting on issues based on predefined criteria. PrioLab facilitates this process through democratic voting, discussion threads, and multiple prioritization methodologies.

### What prioritization frameworks does PrioLab support?
PrioLab supports various frameworks including MoSCoW Method, RICE Framework, Weighted Scoring, and custom prioritization matrices that teams can configure based on their needs.

### Is PrioLab free to use?
Yes, PrioLab is completely free and open-source. You can self-host it or contribute to its development on GitHub.

## Technical Questions

### How does PrioLab integrate with GitHub?
PrioLab uses GitHub's OAuth for authentication and the GitHub API to sync repository and issue data. It respects GitHub's rate limits and only accesses public repository data.

### Can I use PrioLab with private repositories?
Currently, PrioLab is designed to work with public repositories only. Support for private repositories may be added in the future.

### How does the voting algorithm work?
PrioLab's voting algorithm considers multiple factors including raw vote count, vote velocity (how quickly votes accumulate), issue age, and community engagement metrics to generate a comprehensive priority score.

### Can I customize the prioritization metrics?
Yes, project maintainers can customize which factors are weighted most heavily in the prioritization algorithm to match their team's specific needs.

## Usage Questions

### How do I add a repository to PrioLab?
After signing in with your GitHub account, you can search for public repositories and add them to your watchlist. PrioLab will then sync issues from these repositories for prioritization.

### Can I integrate PrioLab with other project management tools?
We're working on integrations with popular project management tools. Currently, you can export prioritization data in CSV format for use in other systems.

### How can I contribute to PrioLab?
You can contribute by submitting pull requests to our GitHub repository, reporting bugs, suggesting features, or helping with documentation. See our Contributing Guidelines for more information.

### How often is issue data synchronized from GitHub?
Issue data is synchronized in real-time for active sessions and on a regular schedule for background updates. You can also manually trigger a sync for any repository in your watchlist.
