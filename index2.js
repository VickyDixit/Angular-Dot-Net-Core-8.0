const simpleGit = require('simple-git');
const { exec } = require('child_process');

// The date threshold (YYYY-MM-DD). Commits after this date will be removed.
const DATE_THRESHOLD = '2024-12-31';


// Initialize the Git repository
const git = simpleGit();

// Function to remove commits after the specified date
const removeCommitsAfterDate = async () => {
    try {
        // Fetch the commit history with dates
        const log = await git.log({
            '--format': '%H|%ad',
            '--date': 'short',
        });

        // Filter commits after the DATE_THRESHOLD
        const commitsToRemove = log.all.filter(commit => {
            const [hash, date] = commit.message.split('|');
            return date > DATE_THRESHOLD;
        });

        if (commitsToRemove.length === 0) {
            console.log(`No commits found after ${DATE_THRESHOLD}.`);
            return;
        }

        console.log(`Commits to remove (after ${DATE_THRESHOLD}):`);
        commitsToRemove.forEach(commit => console.log(commit.hash));

        // Start an interactive rebase
        console.log('Starting rebase to remove commits...');
        exec(
            `git rebase -i $(git rev-list -n 1 --before="${DATE_THRESHOLD}T23:59:59" HEAD)`,
            (err, stdout, stderr) => {
                if (err) {
                    console.error('Error during rebase:', err);
                } else {
                    console.log('Rebase complete. Force push your changes to apply them.');
                }
            }
        );
    } catch (error) {
        console.error('Error fetching Git history:', error);
    }
};

// Call the function
removeCommitsAfterDate();
