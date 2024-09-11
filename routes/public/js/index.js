const socket = io(); // Asegúrate de que la URL coincida con tu servidor

socket.emit("message", "hola me estoy comunicando desde websockets");
