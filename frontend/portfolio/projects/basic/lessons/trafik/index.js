const LAMP = {
  red: document.getElementById("myProgress-red"),
  yellow: document.getElementById("myProgress-yellow"),
  green: document.getElementById("myProgress-green"),
};

let currentState = "stop";

function applyLight(lamp, color) {
  lamp.style.backgroundColor = color;

  if (color === "red" || color === "yellow" || color === "green") {
    lamp.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
  } else {
    lamp.style.boxShadow = "none";
  }
}

function setLights(state) {
  const grey = "grey";

  if (state === "wait") {
    if (currentState === "go") {
      state = "waitToStop";
    } else {
      state = "waitToGo";
    }
  }

  switch (state) {
    case "stop":
      applyLight(LAMP.red, "red");
      applyLight(LAMP.yellow, grey);
      applyLight(LAMP.green, grey);
      break;

    case "waitToGo":
      applyLight(LAMP.red, "red");
      applyLight(LAMP.yellow, "yellow");
      applyLight(LAMP.green, grey);
      break;

    case "waitToStop":
      applyLight(LAMP.red, grey);
      applyLight(LAMP.yellow, "yellow");
      applyLight(LAMP.green, grey);
      break;

    case "go":
      applyLight(LAMP.red, grey);
      applyLight(LAMP.yellow, grey);
      applyLight(LAMP.green, "green");
      break;

    default:
      applyLight(LAMP.red, grey);
      applyLight(LAMP.yellow, grey);
      applyLight(LAMP.green, grey);
  }

  currentState = state;
}