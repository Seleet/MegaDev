function myLight(myColor) {
  let redbutton = document.getElementById("myProgress-" + myColor);
  const lights = document.querySelectorAll(".light");
  switch (myColor) {
    case "red":
      turnTraficLightOff(lights);
      redbutton.style.backgroundColor = myColor;
      break;
    case "yellow":
      if(document.getElementById("myProgress-red").style.backgroundColor === "red")
      {
        document.getElementById("myProgress-red").style.backgroundColor = "red";
        redbutton.style.backgroundColor = myColor;
      }else{
       turnTraficLightOff(lights);
        redbutton.style.backgroundColor = myColor;
      }
      break;
    case "green":
      turnTraficLightOff(lights);
      redbutton.style.backgroundColor = myColor;
      break;
    case "grey":      
      turnTraficLightOff(lights);
    break;
    default:
      redbutton.style.backgroundColor = "grey";
  }

  
  function turnTraficLightOff(lights){
     for (let i = 0; i < lights.length; i++) {
        lights[i].style.backgroundColor = "grey";
      }
  }
}