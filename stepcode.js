import {EventBus, interpret} from 'stepcode';
import {Octokit} from "@octokit/rest";
import * as fs from 'fs';
import * as path from 'path';

const bus = new EventBus();
const octokit = new Octokit();

const OWNER = 'RolandoAndrade';
const REPO = 'stepcode-editor';

let messages = [];
bus.on('output-request', (content) => {
    messages.push(content);
})

const codesPath = 'codes';

fs.readdirSync(codesPath).forEach(async (file) => {
    if (file.endsWith('.stepcode')) {
        const content = fs.readFileSync(path.join(codesPath, file), 'utf8');
        const name = getName(file);
        const description = await getDescription(content);
        const image = await getAvatar(content);
        const result = {
            name: name,
            description: messages.join('\n'),
            image: image,
        };
        console.log(result);
    }
});

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

export async function getAvatar(code) {
    const prMatch = code.match(/#(\d+)/);
    if (prMatch) {
        const pullRequestNumber = prMatch[1];
        return await getUserAvatarUrl(pullRequestNumber);
    }
    const lastPr = await getLatestPR();
    return await getUserAvatarUrl(lastPr);
}


async function getLatestPR() {
    const {data: pullRequests, ...rest} = await octokit.rest.pulls.get({
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