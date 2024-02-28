


const toggler = document.querySelector('.toggle');
const search = document.querySelector('.search button');
const sidebar = document.querySelector('.sidebar');
const list = document.querySelectorAll(".list");

const dashboard = document.querySelector('.dashboard');
const inclination = document.querySelector('.inclination');
const result = document.querySelector('.result');
const test = document.querySelector('.test');

window.onload=function() {
  dashboard.style.display = 'block';
  inclination.style.display = 'none';
  result.style.display = 'none';
  test.style.display = 'none';
};




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
      inclination.style.display = 'none';
      result.style.display = 'none';
      test.style.display = 'none';
      removeActiveClass(list);
      list[0].classList.add("active");
    } else if (param_div_class === "inclination"){
        dashboard.style.display = 'none';
        inclination.style.display = 'block';
        result.style.display = 'none';
        test.style.display = 'none';
        removeActiveClass(list);
        list[1].classList.add("active");
    }
    else if (param_div_class === "result"){
        dashboard.style.display = 'none';
        inclination.style.display = 'none';
        result.style.display = 'block';
        test.style.display = 'none';
        removeActiveClass(list);
        list[2].classList.add("active");
    }
    else if (param_div_class === "test"){
        dashboard.style.display = 'none';
        inclination.style.display = 'none';
        result.style.display = 'none';
        test.style.display = 'block';
        removeActiveClass(list);
        list[3].classList.add("active");
    }
   
};

const dashboard_btn = document.querySelector('.dashboard_btn');
const inclination_btn = document.querySelector('.inclination_btn');
const result_btn = document.querySelector('.result_btn');
const test_btn = document.querySelector('.test_btn');

const dashboard_btn_nav = document.querySelector('.dashboard_btn_nav');
const inclination_btn_nav = document.querySelector('.inclination_btn_nav');
const result_btn_nav = document.querySelector('.result_btn_nav');
const test_btn_nav = document.querySelector('.test_btn_nav');

dashboard_btn.addEventListener("click", () => {

 show('dashboard');
});
inclination_btn.addEventListener("click", () => {
  
  show('inclination');
});
result_btn.addEventListener("click", () => {
  show('result');
});
test_btn.addEventListener("click", () => {
  show('test');
});
dashboard_btn_nav.addEventListener("click", () => {
  show('dashboard');
 });
 inclination_btn_nav.addEventListener("click", () => {
   
   show('inclination');
 });
 result_btn_nav.addEventListener("click", () => {
   show('result');
 });
 test_btn_nav.addEventListener("click", () => {
   show('test');
 });



