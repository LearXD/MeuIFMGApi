import { JSDOM } from "jsdom";

export const extractDataFromHtml = (html) => {

    const DOM = (new JSDOM(html, {runScripts: 'outside-only'}))
    const { document } = DOM.window;

    let subjects = {
        'OUTROS': {}
    }

    if((document.getElementsByClassName("ui-mini").length) <= 1) { // CONTEXT MODAL "FIX"
        return false;
    }

    let currendHead = "";

    const ul = document.querySelectorAll('ul')[1] ?? null
    
    if(!ul) return false;

    ul.querySelectorAll('li').forEach(
        (data) => {
            if(data.getAttribute("data-role")) {
                currendHead = formatName(data.innerHTML);
                subjects[currendHead] = {}
                return;
            }
            if(!data.querySelector("h2") || !data.querySelector('p')) return;

            const subjectName = data.querySelector("h2").innerHTML.replace(/<[^>]*>/, '').trim();

            if(subjectName.includes('&nbsp;')) return;

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