// Area:

// Dish:
export function Dish() {

    // variables:
    let Margin = 2;
    let Scenary = document.getElementById('Dish');
    let Width = Scenary.offsetWidth - (Margin * 2);
    let Height = Scenary.offsetHeight - (Margin * 2) - 150;
    let Cameras = document.getElementsByClassName('Camera');
    let max = 0;

    // loop (i recommend you optimize this)
    let i = 1;
    while (i < 5000) {
        let w = Area(i, Cameras.length, Width, Height, Margin);
        if (w === false) {
            max = i - 1;
            break;
        }
        i++;
    }

    // set styles
    max = max - (Margin * 2);
    setWidth(max, Margin);
}

function Area(Increment, Count, Width, Height, Margin = 10) {
    let i = 0;
    let w = 0;
    let h = Increment * 0.75 + (Margin * 2);
    while (i < (Count)) {
        if ((w + Increment) > Width) {
            w = 0;
            h = h + (Increment * 0.75) + (Margin * 2);
        }
        w = w + Increment + (Margin * 2);
        i++;
    }
    if (h > Height) return false;
    else return Increment;
}

// Set Width and Margin 
function setWidth(width, margin) {
    let Cameras = document.getElementsByClassName('Camera');
    for (var s = 0; s < Cameras.length; s++) {
        Cameras[s].style.width = width + "px";
        Cameras[s].style.margin = margin + "px";
        Cameras[s].style.height = (width * 0.75) + "px";
    }
}

// Load and Resize Event
