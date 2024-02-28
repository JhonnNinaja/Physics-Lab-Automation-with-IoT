
//import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

const toggler = document.querySelector('.toggle');
const search = document.querySelector('.search button');
const sidebar = document.querySelector('.sidebar');
const list = document.querySelectorAll(".list");

const dashboard = document.querySelector('.dashboard');

const test = document.querySelector('.test');




window.onload=function() {
  
    dashboard.style.display = 'block';
    
    test.style.display = 'none';
}


toggler.addEventListener("click", () => {
    document.querySelector('.sidebar').classList.toggle('toggle-sidebar');
    document.querySelector('main').classList.toggle('toggle-main');
});
search.addEventListener("click", () => {
    if (sidebar.classList.contains('toggle-sidebar')) {
    document.querySelector('.sidebar').classList.remove('toggle-sidebar');
    document.querySelector('main').classList.toggle('toggle-main');
    }
});






//remove active class of a nodeList
function removeActiveClass(nodeList) {
    nodeList.forEach(item => {
        item.classList.remove("active");
    });
}

//cambio de ventana



function show(param_div_class) {
    if(param_div_class === "dashboard"){
      dashboard.style.display = 'block';
      
      test.style.display = 'none';
      removeActiveClass(list);
      list[0].classList.add("active");
    } 
    else if (param_div_class === "test"){
        dashboard.style.display = 'none';
        
        test.style.display = 'block';
        removeActiveClass(list);
        list[1].classList.add("active");
    }
   
};

const dashboard_btn = document.querySelector('.dashboard_btn');

const test_btn = document.querySelector('.test_btn');

const dashboard_btn_nav = document.querySelector('.dashboard_btn_nav');

const test_btn_nav = document.querySelector('.test_btn_nav');

dashboard_btn.addEventListener("click", () => {

 show('dashboard');
});

test_btn.addEventListener("click", () => {
  show('test');
});
dashboard_btn_nav.addEventListener("click", () => {
  show('dashboard');
 });
 
 test_btn_nav.addEventListener("click", () => {
   show('test');
 });

//---------------- REGRESION LINEAL ---------------------------//
var asd = [[0,0],[0,1],[1,1]];
  const clean_data = asd

    .filter(({ x, y }) => {
      return (
        typeof x === typeof y &&  // filter out one string & one number
        !isNaN(x) &&              // filter out `NaN`
        !isNaN(y) &&
        Math.abs(x) !== Infinity && 
        Math.abs(y) !== Infinity
      );
    })
    .map(({ x, y }) => {
      return [x, y];             // we need a list of [[x1, y1], [x2, y2], ...]
    });
    
console.log(clean_data);
const my_regression = regression.linear(clean_data);

console.log(my_regression)


