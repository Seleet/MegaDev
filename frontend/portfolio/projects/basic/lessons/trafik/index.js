function myLight(myColor) {
  let redbutton = document.getElementById("myProgress-" + myColor);

  switch (myColor) {
    case "red":
      redbutton.style.backgroundColor = myColor;
      break;
    case "yellow":
      redbutton.style.backgroundColor = myColor;
      break;
    case "green":
      redbutton.style.backgroundColor = myColor;
      break;

    default:
      redbutton.style.backgroundColor = "grey";
  }
}
