import { JSDOM } from "jsdom";

export const extractDOMFromHtml = (html) => {
    return (new JSDOM(html, { runScripts: 'outside-only' })).window.document
}

export const extractAssessments = (html) => {
    const document = extractDOMFromHtml(html);
    const ul = document.querySelector('ul');

    if(!ul) return [];

    const data = [];
    let index = -1;
    ul.querySelectorAll('li').forEach((child) => {

        if(child.getAttribute('data-role') === 'list-divider') {
            index++;
            data.push({role: child.innerHTML.trim(), activities: []})
            return;
        }

        if(index < 0) return

        const split = child.innerHTML.split('\n');
        const spans = child.querySelectorAll('span')

        let name = split[1].trim(),
            note = "",
            value = "",
            date = undefined;

        switch (split.length) {
            case 11:
                date = spans[0].innerHTML.replace(/[^\d/]/g, '').trim()
                note = spans[1].innerHTML.trim()
                value = spans[2].innerHTML.replace(/[^\d,]+/gm, '')
                break;
            default: 
                note = spans[0].innerHTML.trim()
                value = spans[1].innerHTML.replace(/[^\d,]+/gm, '')
                break;
        }
        
        data[index].activities.push({
            name, date, note, value
        })
       
    })

    return data;
}

export const extractSubjects = (html) => {
    const document = extractDOMFromHtml(html);

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

    let subjects = {
        'OUTROS': {}
    }

    if ((document.getElementsByClassName("ui-mini").length) <= 1) { // CONTEXT MODAL "FIX"
        return false;
    }

    let currendHead = "";

    const ul = document.querySelectorAll('ul')[1] ?? null

    if (!ul) return false;

    ul.querySelectorAll('li').forEach(
        (data) => {
            if (data.getAttribute("data-role")) {
                currendHead = formatName(data.innerHTML);
                subjects[currendHead] = {}
                return;
            }
            if (!data.querySelector("h2") || !data.querySelector('p')) return;

            const subjectName = data.querySelector("h2").innerHTML.replace(/<[^>]*>/, '').trim();

            if (subjectName.includes('&nbsp;')) return;

            // TRANSFORMANDO UM GRANDE innerHTML EM UM ARRAY COM STRINGS
            const subjectData = removeHTML(data.querySelector('p').innerHTML)
                .split("\n")
                .map(
                    k => k.
                        replace(/ {16}/g, '')
                        .trim()
                )
                .filter(k => !k.includes('Conceito') && k)

            // TRANSFORMANDO UM ARRAY COM STRINGS EM DADOS
            subjectData.forEach(sData => {
                const [key, value] = sData.split(": ");
                const newObj = {}
                newObj[key] = value;
                subjects[currendHead || 'OUTROS'][subjectName] = {
                    ...newObj,
                    ...subjects[currendHead || 'OUTROS'][subjectName]
                }
            })
        }
    )

    return subjects;
}

export const formatName = (string) => {
    return string.replace(/\s/g, '_').toUpperCase()
}

export const removeHTML = (string) => {
    return string.replace(/<[^>]*>/gm, '').replace(/&nbsp;/g, "\n").trim()
}

//.replace(/\s+/g, '')