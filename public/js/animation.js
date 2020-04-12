const frame = document.querySelector('.main');
const s_d = document.querySelectorAll('.s_d');
// const backbtn = document.querySelector('#back-btn');
// const nextbtn = document.querySelector('#next-btn');

let i = 0;
let size = s_d.clientWidth;
console.log(size);
let duration = setInterval(timer, 2500);


function timer() {
    if (i < 4) {
        s_d.style.transition = 'transform 1s ease-in-out';
        s_d.style.transform = 'translatex(' + (-size * i) + 'px)';
        i++;
    }
}

function expandnews() {
    let view = document.querySelector('.newscontainer');
    if (view.style.display==='none')
    view.style.display = 'block';
    else
    view.style.display='none';
}








// frame.style.transform = 'translatey('+(-size * counter) + 'px)';

//button listner////////



// nextbtn.addEventListener('click',function(){
//     if(counter>=images.length - 1) return;
//    alertsadvert.style.transition = "transform 0.4s ease-in-out";
//     counter++;
//     alertsadvert.style.transform = 'translateX('+(-size * counter) + 'px)';
// });

// backbtn.addEventListener('click',function(){
//     if(counter<=0) return;
//    alertsadvert.style.transition = "transform 0.4s ease-in-out";
//     counter--;
//     alertsadvert.style.transform = 'translateX('+(-size * counter) + 'px)';
// });

// alertsadvert.addEventListener('transitionend',function(){
//    if (images[counter].id === 'imagelast'){
//        alertsadvert.style.transition = "none";
//        counter= images.length -2;
//        alertsadvert.style.transform = 'translateX('+(-size * counter) + 'px)';
//    }
//     if (images[counter].id === 'imagefirst'){
//         alertsadvert.style.transition = "none";
//        counter= images.length - counter;
//        alertsadvert.style.transform = 'translateX('+(-size * counter) + 'px)'; 
//    }
// });
