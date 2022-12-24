import { JSDOM } from "jsdom";

export const extractDataFromHtml = (html) => {

    //console.log(html)
    const { document } = (new JSDOM(html)).window;

    let subjects = {
        'OUTROS': {}
    }

    let currendHead = "";

    document.querySelectorAll('ul')[1].querySelectorAll('li').forEach(
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