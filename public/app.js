const sportList = document.querySelector('#sport-list');
const form = document.querySelector('#add-sport-form');

//create elements and render sport
function renderSport(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let favoriteSport = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id',doc.id);
    name.textContent = doc.data().name;
    favoriteSport.textContent = doc.data().favoriteSport;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(favoriteSport);
    li.appendChild(cross);

    sportList.appendChild(li);

    //deleting data
    cross.addEventListener('click' , (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('sports').doc(id).delete();
    })
}


//Getting data
// db.collection('sports').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderSport(doc);
//     })
// }) 




//Saving data
form.addEventListener('submit' , (e) => {
    e.preventDefault();
    db.collection('sports').add({
        name: form.name.value,
        favoriteSport: form.favoriteSport.value
    })
    form.name.value = '';
    form.favoriteSport.value = '';
})

// Realtime Listener 
db.collection('sports').orderBy('favoriteSport').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    //console.log(changes);
    changes.forEach(change => { 
        if (change.type == 'added'){
            renderSport(change.doc);
        } else if (change.type == 'removed'){
            let li = sportList.querySelector('[data-id=' + change.doc.id + ']');
            sportList.removeChild(li);
        }

    })
})