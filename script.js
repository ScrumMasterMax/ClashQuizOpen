fetch("https://DEIN-SERVER/users")
.then(response => response.json())
.then(data => {

    const list = document.getElementById("users")

    data.forEach(user => {

        const li = document.createElement("li")
        li.textContent = user

        list.appendChild(li)

    })

})
