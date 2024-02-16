let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
//Global Variables
const toyCollectionDiv = document.querySelector("#toy-collection")
function newToyCard(toyPara){
  const toyCard = document.createElement('div')
  toyCard.setAttribute('class','card')
  toyCollectionDiv.append(toyCard)

  const toyName = document.createElement('h2')
  toyName.textContent = toyPara.name

  const toyImg = document.createElement('img')
  toyImg.setAttribute('src', toyPara.image)
  toyImg.setAttribute('class', 'toy-avatar')

  const toyLikes = document.createElement('p')
  toyLikes.textContent = `${toyPara.likes} likes`

  const toyButton = document.createElement('button')
  toyButton.setAttribute('class', 'like-btn')
  toyButton.setAttribute('id', toyPara.id)
  toyButton.textContent = "I like dis 🫶🏻"

  toyButton.addEventListener('click', handleClickLikeEvent)

  toyCard.appendChild(toyName)
  toyCard.appendChild(toyImg)
  toyCard.appendChild(toyLikes)
  toyCard.appendChild(toyButton)
}
//Fetching Andy's Toys
fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(toys => addImagesToDom(toys))
  function addImagesToDom(toys){
    toys.forEach((toy) => newToyCard(toy)) //returns the whole list of object with name, id, etc.
  }

//Adding A New Toy
const toyForm = document.querySelector('form')
toyForm.addEventListener('submit',addingNewToy)

function addingNewToy(event){
  event.preventDefault()
  const toyNameSubmitForm = document.querySelector("form.add-toy-form input[name = 'name']").value
  const toyUrlForm = document.querySelector("form.add-toy-form input[name = 'image']").value
    fetch("http://localhost:3000/toys",{
      method: 'POST',
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
      "name": toyNameSubmitForm,
      "image": toyUrlForm,
      "likes": 0
      })
    })
      .then(resp => resp.json())
      .then(newToy => addNewToyToDom(newToy))
      .catch(error => console.log(error.message))
  }
  function addNewToyToDom(newToy){
    newToyCard(newToy)
  }
  
//Increasing a Toy's Likes
function handleClickLikeEvent(event){ //toy is an the complete list of object
  // console.log(event)
  const buttonId = event.target.id
  // console.log(buttonId)
  
  fetch(`http://localhost:3000/toys/${buttonId}`)
  .then(resp => resp.json())
  .then(likesAmount => updateNumberOfLikes(likesAmount.likes, buttonId)) //will return the current number of likes of a certain toy
}

function updateNumberOfLikes(likesAmount, buttonId){
  likesAmount = likesAmount+1 //new number of likes
  fetch(`http://localhost:3000/toys/${buttonId}`, {
  method: 'PATCH',
  headers:{
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  body: JSON.stringify({
    "likes": likesAmount
    })
  })
  .then(resp => resp.json())
  .then(likesForTheDom => updateDomLikes(likesForTheDom.likes, buttonId) )
}

function updateDomLikes(likesDataForDom, buttonId){
  const buttonLine = document.getElementById(`${buttonId}`)
  const buttonLineParent = buttonLine.parentNode
  const pChild = buttonLineParent.querySelector('p')
  pChild.textContent = `${parseInt(likesDataForDom)} likes`
}