
const url = (window.location.hostname == "localhost") 
  ? "http://localhost:8080/api/auth/"
  : ""

let socket = null;
let user = null;
const token = localStorage.getItem("token") || "";

// Referencias HTML
const txtUid = document.getElementById("txtUid");
const txtMessage = document.getElementById("txtMessage");
const ulUsers = document.getElementById("ulUsers");
const ulMessages = document.getElementById("ulMessages");
const ulMessagesPrivate = document.getElementById("ulMessagesPrivate");
const btnLogout = document.getElementById("btnLogout")

const validToken = async () => {

  const response = await fetch( url, {
    headers: { "Authorization": token}
  });

  const { user: userDB, token: tokenDB } = await response.json();
  localStorage.setItem("token", tokenDB);
  user = userDB

  await connectSocket();
}

const connectSocket = async () => {

  socket = io({
    extraHeaders: { "Authorization": localStorage.getItem("token") }
  });

  socket.on('connect', () => {
    console.log("Sockets online");
  })

  socket.on('disconnect', () => {
    localStorage.clear();
    window.location = "index.html";
    console.log("Sockets offline");
  })

  socket.on('receive-message', drawMessages)

  socket.on('users-active', drawUsers)

  socket.on('private-message', drawMessagesPrivate)

}

btnLogout.addEventListener("click", () => {
  localStorage.clear();
  window.location = "index.html";
})

const drawUsers = ( users = [] ) => {
  let usersHtml = "";

  users.forEach( ({ name, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success">${ name }</h5>
          <span class="fs-6 text-muted">${ uid }</span>
        </p>
      </li>
    `
  }) 

  ulUsers.innerHTML = usersHtml;
}

const drawMessages = ( messages = [] ) => {
  let messagesHtml = "";

  messages.forEach( ({ name, message }) => {
    messagesHtml += `
      <li>
        <p>
          <span class="text-primary">${ name }: </span>
          <span>${ message }</span>
        </p>
      </li>
    `
  }) 

  ulMessages.innerHTML = messagesHtml;
}

const drawMessagesPrivate = ( { of, message } ) => {
  let messagesHtml = `
      <li>
        <p>
          <span class="text-info">${ of }: </span>
          <span>${ message }</span>
        </p>
      </li>
    `

  ulMessagesPrivate.innerHTML = messagesHtml;
}

txtMessage.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMessage.value;
  const uid = txtUid.value

  if (keyCode !== 13) return;
  if (message.length === 0) return;

  socket.emit("send-message", { message, uid })
  txtMessage.value = "";
})

const main = async () => {
  // Validar JWT
  await validToken();
}

main()


