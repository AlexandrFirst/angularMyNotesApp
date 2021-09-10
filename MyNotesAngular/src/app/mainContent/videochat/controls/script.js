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
export function add(videoSource, audioSource) {
    let Scenary = document.getElementById('Dish');
    
    let Camera = document.createElement('div');
    Camera.className = 'Camera';

    let Video = document.createElement("video");
    Video.setAttribute('autoplay', " ");
    Video.srcObject = null;
    Video.srcObject = videoSource;

    
    let Audio = document.createElement('audio');
    Audio.setAttribute('autoplay', " ");
    Audio.srcObject = null;
    Audio.srcObject = audioSource;

    Camera.appendChild(Video)
    Camera.appendChild(Audio)

    Scenary.appendChild(Camera);
    Dish();
}

