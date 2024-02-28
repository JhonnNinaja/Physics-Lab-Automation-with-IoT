import { database, ref,child, set, onValue,  push, update, get, remove} from "./lib/firebaseLib.js";
import { auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "./lib/firebaseLib.js";

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = loginForm['input-email'].value;
  const password = loginForm['input-password'].value;
  // log the user in
  signInWithEmailAndPassword(auth, email, password).then((cred) => {
    // close the login modal & reset form
    loginForm.reset();
    console.log(email);
    //switch to dynamic page
    //window.location.href = "index.html";

  })
  .catch((error) =>{
    const errorCode = error.code;
    const errorMessage = error.message;
    document.getElementById("error-message").innerHTML = errorMessage;
    console.log(errorMessage);
  }
  );
});
const googleButton = document.querySelector('#google-login');
googleButton.addEventListener('click', (e) => {
  e.preventDefault();

  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...

    //switch to dynamic page
    
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorMessage);
    alert(errorMessage);
    // ...
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // select by id "SignOut" button
    const logout = document.querySelectorAll('.SignOut');
    logout.forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
          document.querySelector(".loginBox").style.display = "block";
          document.querySelector(".container").style.display = "none";
        }).catch((error) => {
          // An error happened.
          console.log(error);
        });
      });
    });
    document.querySelector(".loginBox").style.display = "none";
    document.querySelector(".container").style.display = "block";
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    
    const uid = user.uid;
    console.log(uid);
    function showMeasures(measures){
      const table_1 = document.querySelector('#tbody_1');
      table_1.innerHTML = '';
      let measuresArray = Object.keys(measures).map(key => measures[key]);
      console.log(measures);
      //extract keys of an measuresArray
      //let keys = Object.keys(measuresArray);
      //console.log(keys);
      measuresArray.forEach(medidas => {
        //get index of each element
        let index = measuresArray.indexOf(medidas);
        //get measuresArray key
        let key = Object.keys(measures)[index];
        //this line obtain the mean T of each measure
          
        table_1.innerHTML += `
        <tr>
          <td style="display:none" class="key_id">${key}</td>
          <td>${index + 1}</td>
          <td>${medidas.freq1}</td>
          <td>${medidas.caud1}</td>
          <td>${medidas.freq2}</td>
          <td>${medidas.caud2}</td>
          <td><button class="delete">Delete</button></td>
    
        </tr>
        `;
    
        
        
      });
    
      //esta función va acá pero no se por qué
      const removeData = document.querySelector(".delete-all-data");
      
        
      removeData.addEventListener('click', e => {
        console.log("remove all data from fmechanics");
        remove(ref(database,'fmechanics'));
      
      });
    
      const deleteButtons = document.querySelectorAll('.delete');
      deleteButtons.forEach(button => {
        button.addEventListener('click', e => {
          let key = e.target.parentElement.parentElement.querySelector('.key_id').innerHTML;
          console.log(key);
          remove(ref(database,'fmechanics/' + key));
        });
      });
     
    };
    
    
    onValue(ref(database,"/fmechanics"), (snapshot) => {
    
      if(snapshot.exists()){
        showMeasures(snapshot.val());
      }else{
        console.log("No data available");
        //document.querySelector("#thead_1").innerHTML = "<tr><td>Alert!</td></tr>";
        document.querySelector("#tbody_1").innerHTML = "<tr><td>No data available</td></tr>";
      }
    
    });
  } else {
    // User is signed out
    // ...
  }
});





 