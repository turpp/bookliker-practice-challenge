document.addEventListener("DOMContentLoaded", function() {
const listPanel = document.getElementById('list-panel')
const showPanel = document.getElementById('show-panel')

fetch(`http://localhost:3000/books`).then(resp => resp.json()).then(function(books){
    console.log(books)
    books.forEach(function(book){
        listPanel.innerHTML += `<li id=${book.id}>${book.title}</li>`
    })
})

listPanel.addEventListener('click', function(e){
    fetch(`http://localhost:3000/books/${e.target.id}`).then(resp => resp.json()).then(function(book){
        showPanel.innerHTML = `
        <img src=${book.img_url} alt='book cover'>
        <h3>${book.title}</h3>
        <h4>${book.subtitle}</h4>
        <h4>${book.author}</h4>
        <p>${book.description}</p>
        <ul>
        ${book.users.map(function(user){
            return `<li id='user-${user.id}'>${user.username}</li>`
        }).join('')}
        </ul>
        ${whatButton(book)}
        
        `
        return book
    })
})

    showPanel.addEventListener('click', function(e){
        console.log(e.target, e.target.dataset.status)
        if(e.target.dataset.status == "unlike"){
        let routeId = e.target.id.split('-')[2]
        fetch(`http://localhost:3000/books/${routeId}`).then(resp => resp.json()).then(function(book){
            console.log('before', book.users.length)
            let me = book.users.findIndex(el => el.id == 1)
            book.users.splice(me,1)
            console.log('after', book.users.length)

            fetch(`http://localhost:3000/books/${routeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    author: book.author,
                    description: book.description,
                    id: book.id,
                    img_url: book.img_url,
                    subtitle: book.subtitle,
                    title: book.title,
                    users: book.users
                })
            }).then(resp => resp.json()).then(function(book){
                showPanel.innerHTML = `
                    <img src=${book.img_url} alt='book cover'>
                    <h3>${book.title}</h3>
                    <h4>${book.subtitle}</h4>
                    <h4>${book.author}</h4>
                    <p>${book.description}</p>
                    <ul>
                    ${book.users.map(function(user){
                        return `<li id='user-${user.id}'>${user.username}</li>`
                    }).join('')}
                    </ul>
                    <button data-status='like' id=button-for-${book.id}>Like</button>
                    `

                })
    })
}else {
    let routeId = e.target.id.split('-')[2]
    fetch(`http://localhost:3000/books/${routeId}`).then(resp => resp.json()).then(function(book){
        book.users.push({id:1, username:"pouros"})
        fetch(`http://localhost:3000/books/${routeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                author: book.author,
                description: book.description,
                id: book.id,
                img_url: book.img_url,
                subtitle: book.subtitle,
                title: book.title,
                users: book.users
            })
        }).then(resp => resp.json()).then(function(book){
            showPanel.innerHTML = `
                <img src=${book.img_url} alt='book cover'>
                <h3>${book.title}</h3>
                <h4>${book.subtitle}</h4>
                <h4>${book.author}</h4>
                <p>${book.description}</p>
                <ul>
                ${book.users.map(function(user){
                    return `<li id='user-${user.id}'>${user.username}</li>`
                }).join('')}
                </ul>
                <button data-status='unlike' id=button-for-${book.id}>Unlike</button>
                `
        })
    })

}
})





















function whatButton(book){
    if(!!book.users.find(user => user.id == 1)){
        return `<button data-status = unlike id=button-for-${book.id}>Unlike</button>`
    } else {
        return `<button data-status = like id=button-for-${book.id}>Like</button>`
    }
}
});
