import {EventBus, interpret} from 'stepcode';
import {Octokit} from "@octokit/rest";
import * as fs from 'fs';
import * as path from 'path';

const bus = new EventBus();
const octokit = new Octokit();

const OWNER = 'RolandoAndrade';
const REPO = 'yearbook202415';

let messages = [];
bus.on('output-request', (content) => {
    messages.push(content);
})

const codesPath = 'codes';
const entries = [];

for (const file of fs.readdirSync(codesPath)) {
    if (file.endsWith('.stepcode')) {
        const content = fs.readFileSync(path.join(codesPath, file), 'utf8');
        const name = getName(file);
        const description = await getDescription(content);
        const image = await getAvatar(content, file);
        const result = {
            name: name,
            description: description,
            image: image,
        };
        entries.push(result);
    } else {
        throw new Error(`Expected file ${file} to end with .stepcode`);
    }
}

writeToFile(entries);


function writeToFile(entries) {
    console.log(entries);
    fs.writeFile('src/assets/entries.json', JSON.stringify(entries), function (err) {
        if (err) return console.log(err);
    });
}

async function getUserAvatarUrl(pullRequestNumber) {
    const {data: pullRequest} = await octokit.rest.pulls.get({
        owner: OWNER,
        repo: REPO,
        pull_number: pullRequestNumber,
    });

    return pullRequest.user.avatar_url;
}

export async function getDescription(code) {
    messages = [];
    await interpret({code, eventBus: bus});
    return messages.join('\n');
}

export function getName(file) {
    const [namePart] = file.split('.');
    return namePart.replace(/_/g, ' ');
}

export async function getAvatar(code, file) {
    const prMatch = code.match(/#(\d+)/);
    if (prMatch) {
        const pullRequestNumber = prMatch[1];
        return await getUserAvatarUrl(pullRequestNumber);
    }
    const lastPr = await getLatestPR();
    code = `// #${lastPr}\n${code}`
    fs.writeFileSync(path.join(codesPath, file), code);
    return await getUserAvatarUrl(lastPr);
}


async function getLatestPR() {
    const {data: pullRequests} = await octokit.rest.pulls.get({
        owner: OWNER,
        repo: REPO,
        state: 'all'
    });

    if (pullRequests.length > 0) {
        const latestPR = pullRequests[0];
        return latestPR.number;
    }
    throw new Error("No pull requests found.");
}