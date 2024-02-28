import { database, ref,child, set, onValue,  push, update, get, remove} from "./lib/firebaseLib.js";
import { auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "./lib/firebaseLib.js";

//auth with email and password (firebase) with login form 
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = loginForm['input-email'].value;
  const password = loginForm['input-password'].value;
  // log the user in
  signInWithEmailAndPassword(auth, email, password).then((cred) => {
    // close the login modal & reset form
    const user = cred.user;
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
//auth with google gutton with id "google-login" with firebase
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
          <td>${medidas.masa}</td>
          <td>${(medidas.T1/1000).toFixed(3)}</td>
          <td>${(medidas.T2/1000).toFixed(3)}</td>
          <td>${(medidas.T3/1000).toFixed(3)}</td>
          <td>${(medidas.T4/1000).toFixed(3)}</td>
          <td>${(medidas.T5/1000).toFixed(3)}</td>
          <td><button class="delete">Delete</button></td>
    
        </tr>
        `;
    
        
        
      });
    
      //esta función va acá pero no se por qué
      const removeData = document.querySelectorAll(".delete");
      removeData.forEach(btn => {
        
        btn.addEventListener('click', e => {
          let id = e.target.parentElement.parentElement.firstElementChild.textContent;
          //remove data from the database
          console.log("remove: ",id);
          remove(ref(database,'dynamic/'+id));
          remove(ref(database,'result/'+id));
    
    
        });
      });
    
     
    };
    
    const update_mass = document.querySelector('.modify-data');
    update_mass.addEventListener('click', e => {
      e.preventDefault();
      const no = document.querySelector('#input-no').value;
      const mass = document.querySelector('#input-mass').value;
      const k = document.querySelectorAll('.key_id');
    
      console.log(k[no-1].innerHTML);
      
      update(ref(database,'dynamic/'+k[no-1].innerHTML),{
        masa: mass
      });
    });
    //push data to firebase
    const pushData = document.querySelector(".add-data");
    pushData.addEventListener("click", (e) => {
      
      // Get a key for a new Post.
      const newPostKey = push(ref(database,"/merma"), 'posts').key;
      const llave_maestra = newPostKey;
      const data = {
        ID: llave_maestra,
        masa: 0,
        T1: 0,
        T2: 0,
        T3: 0,
        T4: 0,
        T5: 0
        
      }
    
      const updates = {};
    
      updates['/dynamic/' + llave_maestra] = data;
      return update(ref(database,"/"),updates);
    });
    
    
  
  
  
    onValue(ref(database,"/dynamic"), (snapshot) => {
      console.log("la función showMeasures");
      if(snapshot.exists()){
        showMeasures(snapshot.val());
      }else{
        console.log("No data available");
        //document.querySelector("#thead_1").innerHTML = "<tr><td>Alert!</td></tr>";
        document.querySelector("#tbody_1").innerHTML = "<tr><td>No data available</td></tr>";
      }
    
    }, (error) => {
      console.error(error);
    });
  
  
    // this function update de distance on the database when the user click on the button
  
  const update_distance = document.querySelector('.modify-distance');
  update_distance.addEventListener('click', e => {
      e.preventDefault();
      const distance = document.querySelector('#input-distance').value;
      document.querySelector("#distance").innerHTML = distance;
      update(ref(database,'distance'),{
          distance: distance
      });
  });
  
  //this function update de angle on the database when the user click on the button
  
  const update_angle = document.querySelector('.modify-angle');
  update_angle.addEventListener('click', e => {
      e.preventDefault();
      let angle = document.querySelector('#input-angle').value;
      //document.querySelector("#angle").innerHTML = angle;
      //update number on a firebase
      //convert string to number
      angle = Number(angle);
  
  
      update(ref(database,'/'),{
          inclination: angle
      });
  });
  
  
  
  const update_result = document.querySelector('.update-result');
  update_result.addEventListener('click', e => {
      e.preventDefault();
      //get data from database once
      get(child(ref(database,'dynamic'),'/')).then((snapshot) => {
          if (snapshot.exists()) {
              console.log("---------------------");
              //console.log(snapshot.val());
              let measuresArray = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
              
              
              
              get(ref(database,'distance/')).then((snapshot) => {
                  if (snapshot.exists()) {
                      
                      let distance = snapshot.val().distance;
                      
                      
              
                  // forEach of measuresArray
                      measuresArray.forEach(medidas => {
  
                          //get index of each element
                          let index = measuresArray.indexOf(medidas);
                          //get measuresArray key
                          let key = measuresArray[index].ID; //este
                          console.log("la llave es: ",key);
                          let masa = medidas.masa;
                          //this line obtain the mean T of each measure
                          let meanT = (medidas.T1/1000 + medidas.T2/1000 + medidas.T3/1000 + medidas.T4/1000 + medidas.T5/1000)/5; 
                          console.log("meanT: " + meanT);
                          let acc = 2*(distance)/(meanT*meanT);
  
                          
                          let force = masa*acc;
                          console.log("distancedjskldjfk: " + distance);
                          console.log("acceleration: " + acc);
                          //console.log("mean: " +meanT);
                          //append the database with the mean T
                          
                          update(ref(database,"result/"+key),{
                              mean: meanT,
                              acel: acc,
                              force: force,
                              masa: masa
                          });
  
                          
                  
              });
  
                  } else {
                      console.log("No data available");
                  }
              }).catch((error) => {
                  console.error(error);
              });
  
  
              showAllResults();
              
          } else {
              console.log("No data available");
          }
      }).catch((error) => {
          console.error(error);
      });
  
      
  });
  
  //this function show all the results on the tables
  const table_2 = document.querySelector("#tbody_2");
  const table_3 = document.querySelector("#tbody_3");
  const table_4 = document.querySelector("#tbody_4");
  const table_5 = document.querySelector("#tbody_5");
  
  function showAllResults(){
      //get data from database once
      get(child(ref(database,'result'),'/')).then((snapshot) => {
          if (snapshot.exists()){
              
              let resultsArray = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
              console.log(resultsArray);
              table_2.innerHTML = '';
              table_3.innerHTML = '';
              table_4.innerHTML = '';
              table_5.innerHTML = '';
  
  
              //list for concatenate on forEach
              let arr1 = [];
              let arr2 = [];
  
              resultsArray.forEach(result => {
                  let index = resultsArray.indexOf(result);
                  let mean = resultsArray[index].mean;
                  let acel = resultsArray[index].acel;
                  let force = resultsArray[index].force;
                  let masa = resultsArray[index].masa;
                  //convert mean to number
                  mean = Number(mean);
                  //convert acel to number
                  acel = Number(acel);
                  //convert force to number
                  force = Number(force);
                  //convert masa to number
                  masa = Number(masa);
  
                  var aux = [acel,force];
                  arr1.push(aux);
                  
                  table_2.innerHTML += `
                  <tr>
                      
                      <td>${index + 1}</td>
                      <td>${masa.toFixed(3)}</td>
                      <td>${mean.toFixed(3)}</td>
                  </tr>
                  `;
                  table_3.innerHTML += `
                  <tr>
                      
                      <td>${index + 1}</td>
                      <td>${mean.toFixed(3)}</td>
                      <td>${acel.toFixed(3)}</td>
                  </tr>
                  `;
                  table_4.innerHTML += `
                  <tr>
                      
                      <td>${index + 1}</td>
                      <td>${masa.toFixed(3)}</td>
                      <td>${force.toFixed(3)}</td>
                  </tr>
                  `;
                  table_5.innerHTML += `
                  <tr>
                      
                      <td>${index + 1}</td>
                      <td>${(acel).toFixed(3)}</td>
                      <td>${(force).toFixed(3)}</td>
                  </tr>
                  `;
                  
  
              });
              //aquí va una función para dibujar obtener los gráficos
  
              //obtain linear regressión from a function
              //og("No data available");
              console.log(arr1);
              OPlinearRegression(arr1);
              
  
              
          }
      }).catch((error) => {
          console.error(error);
      });
  
  };
  
  var ctx = document.getElementById('myChart');
  var myChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        labels: ["Sunday"],
        datasets: [{ 
            data: [],
            label: "Regresion Lineal",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            
          },{ 
            data: [],
            label: "Datos experimentales",
            borderColor: "#FF0000",
            backgroundColor: "#FF0000",
            
          }]
      },
      options: {
        title: {
          display: true,
          text: 'Gráfica de fuerza vs aceleración'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Fuerza (N)'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Aceleración (m/s^2)'
            }
          }]
        }
      }
      
  
      
    });
  
  
  function OPlinearRegression(arr){
    const my_regression = regression.linear(arr);
    console.log("regression");
    console.log(my_regression);
    console.log("points");
    console.log(my_regression.points);
    console.log("equation");
    console.log(my_regression.equation);
    console.log("String");
    console.log(my_regression.string);
    console.log("r2");
    console.log(my_regression.r2);
    const useful_points = my_regression.points.map(([x, y]) => {
      return {x,y};    
      // or {x, y}, depending on whether you just want y-coords for a 'linear' plot
      // or x&y for a 'scatterplot'
    });
    let useful_points2 = [useful_points[0], useful_points[useful_points.length-1]];
    const experimental_points = arr.map(([x, y]) => {
      return {x,y};
    });
    console.log("useful points");
    console.log(useful_points2);
  
    //update myChart with useful_points
    //myChart.data.datasets[0].data = useful_points;
  
    //update myChart with useful_points and styles
    myChart.data.datasets[0].data = useful_points2;
    myChart.data.datasets[0].backgroundColor = "#7bb6dd";
    myChart.data.datasets[0].borderColor = "#3e95cd";
    myChart.data.datasets[0].borderWidth = 3;
    myChart.data.datasets[0].pointRadius = 2;
    myChart.data.datasets[0].fill = false;
    myChart.data.datasets[0].showLine = true;
    myChart.data.datasets[0].lineTension = 0;
    myChart.data.datasets[0].pointHitRadius = 10;
    myChart.data.datasets[0].pointHoverRadius = 5;
    myChart.data.datasets[0].pointHoverBackgroundColor = "#3e95cd";
    myChart.data.datasets[0].pointHoverBorderColor = "#3e95cd";
  
    //update myChart with experimental_points and styles
    myChart.data.datasets[1].data = experimental_points;
    myChart.data.datasets[1].backgroundColor = "#FF0000";
    myChart.data.datasets[1].borderColor = "#FF0000";
    myChart.data.datasets[1].borderWidth = 3;
    myChart.update();
  
  
    //update chart.js options with new regression line
  
    //get element by id anf modify html
    document.getElementById("linear_equation_modify").innerHTML = my_regression.string;
    document.getElementById("correlation_modify").innerHTML = my_regression.r2;
  
  };
  
  
  

    // ...
  } else {
    // User is signed out
    // ...
  }
});



