import { JSDOM } from "jsdom";

export const extractDOMFromHtml = (html) => {
    return (new JSDOM(html, { runScripts: 'outside-only' })).window.document
}

export const extractAssessments = (html) => {
    const document = extractDOMFromHtml(html);

    if ((document.getElementsByClassName("ui-mini").length) <= 1) { // CONTEXT MODAL "FIX"
        return false;
    }

    const ul = document.querySelector('ul');

    if (!ul) return [];

    const data = [];
    let index = -1;
    ul.querySelectorAll('li').forEach((child) => {

        if (child.getAttribute('data-role') === 'list-divider') {
            index++;
            data.push({ role: child.innerHTML.trim(), activities: [] })
            return;
        }

        if (index < 0) return

        const split = child.innerHTML.split('\n');
        const spans = child.querySelectorAll('span')

        let name = split[1].trim(),
            grade = "",
            value = "",
            date = undefined;

        switch (split.length) {
            case 11:
                date = spans[0].innerHTML.replace(/[^\d/]/g, '').trim()
                grade = spans[1].innerHTML.trim()
                value = spans[2].innerHTML.replace(/[^\d,]+/gm, '')
                break;
            default:
                grade = spans[0].innerHTML.trim()
                value = spans[1].innerHTML.replace(/[^\d,]+/gm, '')
                break;
        }

        data[index].activities.push({
            name, date, grade, value
        })

    })

    return data;
}

export const extractSubjects = (html) => {
    const document = extractDOMFromHtml(html);

    if ((document.getElementsByClassName("ui-mini").length) <= 1) { // CONTEXT MODAL "FIX"
        return false;
    }

    const subjects = [];

    const select = document.querySelector('#ddlTurmaDisc')

    if (!select) return subjects;

    select.querySelectorAll('option').forEach((child) => {
        if (child.getAttribute('value') > -1) {
            subjects.push({
                name: child.innerHTML,
                id: child.getAttribute('value')
            })
        }
    })

    return subjects;
}

export const extractHistoric = (html) => {

    const document = extractDOMFromHtml(html);

    if ((document.getElementsByClassName("ui-mini").length) <= 1) { // CONTEXT MODAL "FIX"
        return false;
    }

    const ul = document.querySelectorAll('ul')[1] ?? null
    if (!ul) return false;

    let subjects = []
    let current = -1;

    ul.querySelectorAll('li').forEach(
        (data) => {

            if (data.getAttribute("data-role")) {
                current = subjects.length;
                subjects.push({ period: formatName(data.innerHTML), subjects: [] })
                return;
            }

            if (current < 0 || !data.querySelector("h2") || !data.querySelector('p')) return;

            const subjectName = data.querySelector("h2").innerHTML.replace(/<[^>]*>/, '').trim();
            if (subjectName.includes('&nbsp;')) return;

            let index = subjects[current].subjects.length

            subjects[current].subjects.push({
                name: subjectName,
                data: {}
            })

            const subjectData = removeHTML(data.querySelector('p').innerHTML)
                .split("\n")
                .map(
                    k => k.
                        replace(/ {16}/g, '')
                        .trim()
                )
                .filter(k => !k.includes('Conceito') && k)


            subjectData.forEach(sData => {
                const [key, value] = sData.split(": ");

                const newObj = {}
                newObj[key] = value;

                subjects[current].subjects[index].data = {
                    ...subjects[current].subjects[index].data,
                    ...newObj
                }
            })
        }
    )

    return subjects;
}


export const extractWarnings = (html) => {

    const document = extractDOMFromHtml(html);

    const data = [];
    document.querySelectorAll("ul")[0].querySelectorAll('li:not([data-role="list-divider"])').forEach((element) => {
        data.push({
            subject: element.querySelector('h3').innerHTML,
            room: element.querySelectorAll('p')[0].innerHTML,
            situation: element.querySelectorAll('p')[1].innerHTML,
            absences: element.querySelector('span').innerHTML
        })
    })

    return data;
}

export const formatName = (string) => {
    return string.replace(/\s/g, '_').toUpperCase()
}

export const removeHTML = (string) => {
    return string.replace(/<[^>]*>/gm, '').replace(/&nbsp;/g, "\n").trim()
}

//.replace(/\s+/g, '')