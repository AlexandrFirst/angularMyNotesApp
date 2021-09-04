// Function to delete Camera
export function less() {
    let Cameras = document.getElementsByClassName('Camera');
    if (Cameras.length > 1) {
        let Camera = Cameras[Cameras.length - 1];
        Camera.parentNode.removeChild(Camera);
    }
    Dish();
}

// Function to add Camera
export function add() {
    let Scenary = document.getElementById('Dish');
    let Camera = document.createElement('div');
    Camera.className = 'Camera';
    Scenary.appendChild(Camera);
    Dish();
}

