import dataService from "../models/DataService";

function sortByDate(questions) {
    const q = questions;
    q.sort(function (a, b) {
        const keyA = new Date(a.askDate),
            keyB = new Date(b.askDate);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    });
    return q;
}

function formatDateMetadata(postedDate) {
    const posted = new Date(postedDate);
    const dayNum = posted.getDate() > 9 ? posted.getDate().toString() : "0" + posted.getDate();
    const viewed = new Date();

    const timeDifference = viewed - posted;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const yearsDifference = Math.floor(daysDifference / 365);

    if (yearsDifference >= 1) {
        return `${month.get(posted.getMonth().toString())} ${dayNum}, ${posted.getFullYear().toString()} at ${posted.toLocaleTimeString('en-US', {hour12: false})}`;
    } else if (daysDifference >= 1) {
        return `${month.get(posted.getMonth().toString())} ${dayNum} at ${posted.toLocaleTimeString('en-US', {hour12: false})}`;
    } else if (hoursDifference >= 1) {
        return `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutesDifference >= 1) {
        return `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`;
    } else {
        return `${secondsDifference} ${secondsDifference === 1 ? 'second' : 'seconds'} ago`;
    } 
}

const month = new Map([
    ["0", "Jan"],
    ["1", "Feb"],
    ["2", "Mar"],
    ["3", "Apr"],
    ["4", "May"],
    ["5", "Jun"],
    ["6", "Jul"],
    ["7", "Aug"],
    ["8", "Sep"],
    ["9", "Oct"],
    ["10", "Nov"],
    ["11", "Dec"]
]);
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sortByActive(questions) {
    const q = questions;
    q.sort((a, b) => {
        const mostRecentAnswerDateA = Math.max(
            ...a.answers.map((ansId) =>
                dataService.answers.find((answer) => answer.aid === ansId)?.ansDate.getTime() || 0
            )
        );
        const mostRecentAnswerDateB = Math.max(
            ...b.answers.map((ansId) =>
                dataService.answers.find((answer) => answer.aid === ansId)?.ansDate.getTime() || 0
            )
        );
        return mostRecentAnswerDateB - mostRecentAnswerDateA;
    });
    return q;
}

function sortByUnanswered(questions) {
    let sortedQuestion = [];
    sortedQuestion = questions.filter(question => question.answers.length === 0)
    return sortedQuestion;
}

function sortAnswerByDate(question) {
    question.ansIds.sort(function (a, b) {
        const a1 = dataService.answers.find(ans => ans.aid === a);
        const a2 = dataService.answers.find(ans => ans.aid === b);
        const keyA = new Date(a1.ansDate),
            keyB = new Date(a2.ansDate);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    });
}

const performSearch = (searchInput) => {
    const searchQuery = searchInput.toLowerCase();
    const searchTerms = searchQuery.split(" ");

    const text = dataService.questions.filter((question) => {
        const titleTextMatch = searchTerms.some((term) =>
            question.title.toLowerCase().split(/\s+/).includes(term) ||
            question.text.toLowerCase().split(/\s+/).includes(term)
        );
        return titleTextMatch;
    });
    const tag = dataService.questions.filter((question) => {
        const tagMatch = searchQuery.includes("[") && searchQuery.includes("]")
            ? question.tagIds.some((tagId) =>
                searchQuery.includes(`[${dataService.tags.find((tag) => tag.tid === tagId).name}]`)
            ) : false;

        return tagMatch;
    });

    const ques = []
    text.forEach(q => ques.push(q));
    tag.forEach(q => ques.push(q));
    return ques;
}

const performTagSearch = (tagId) => {
    const ques = dataService.questions.filter((q) => q.tagIds.includes(tagId));
    return ques;
}

function replaceBetween(origin, startIndex, endIndex, insertion) {
    return origin.substring(0, startIndex) + insertion + origin.substring(endIndex);
  }

const parseStringForUrl = (text) => {
    let returnText = text;
    let startIdx;
    let endIdx;
    let label = "";
    let url = "";
    let curChar;
    let sBool = false;
    let uBool = false;
    for(let i=0; i<returnText.length; i++) {
        curChar = returnText.charAt(i);
        if(sBool) {
            if(curChar === '[') {
                return "";
            } else if (curChar === ']') {
                sBool = false;
            } else {
                label += curChar;
            }
        } else if(uBool) {
            if(curChar === '(') {
                return "";
            } else if(curChar === ')') {
                if(!url.includes("https://")) {
                    return "";
                }
                endIdx = i;
                const a = '<a target="_blank" href="' + url + '">' + label + "</a>"
                returnText = replaceBetween(returnText, startIdx, endIdx+1, a);
                label = "";
                url = "";
                sBool = false;
                uBool = false;
                i = 0;
            } else {
                url += curChar;
            }
        }
        if(curChar === '[') {
            if(label !== "") {
                return "";
            }
            startIdx = i;
            sBool = true;
        } else if (curChar === '(' && url === "") {
            if(label === "") {
                return "";
            }
            uBool = true;
        }
    }
    if(uBool || sBool) {
        return "";
    }

    return returnText;
}

const baseURL = "https://localhost:8000/api/";

export {baseURL, sortByDate, formatDateMetadata, getRandomInt, sortByActive, sortByUnanswered, sortAnswerByDate, performSearch, performTagSearch, parseStringForUrl}