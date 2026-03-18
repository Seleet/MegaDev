function roundToNearestTwoPointFive(number) {
  return Math.round(number / 2.5) * 2.5;
}

const form = document.getElementById("rm-form");
const oneRepMaxOutput = document.getElementById("one-rep-max");
const percentageBody = document.getElementById("percentage-body");
const repmaxBody = document.getElementById("repmax-body");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // 🔥 FIX: hantera både , och .
  const weightInput = document.getElementById("weight").value;
  const weight = parseFloat(weightInput.replace(/,/g, "."));

  const reps = parseInt(document.getElementById("reps").value, 10);

  if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
    oneRepMaxOutput.textContent = "-";
    percentageBody.innerHTML = "";
    repmaxBody.innerHTML = "";
    return;
  }

  const oneRM = weight * (1 + reps / 30);
  const roundedOneRM = roundToNearestTwoPointFive(oneRM);

  oneRepMaxOutput.textContent = roundedOneRM.toFixed(1) + " kg";

  percentageBody.innerHTML = "";
  repmaxBody.innerHTML = "";

  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60];

  percentages.forEach(function (percent) {
    const tr = document.createElement("tr");
    const tdPercent = document.createElement("td");
    const tdWeight = document.createElement("td");

    const weightAtPercent = oneRM * (percent / 100);
    const roundedWeight = roundToNearestTwoPointFive(weightAtPercent);

    tdPercent.textContent = percent + "%";
    tdWeight.textContent = roundedWeight.toFixed(1) + " kg";

    tr.appendChild(tdPercent);
    tr.appendChild(tdWeight);
    percentageBody.appendChild(tr);
  });

  for (let r = 1; r <= 10; r++) {
    const tr = document.createElement("tr");
    const tdReps = document.createElement("td");
    const tdWeight = document.createElement("td");

    const weightAtReps = oneRM / (1 + r / 30);
    const roundedWeight = roundToNearestTwoPointFive(weightAtReps);

    tdReps.textContent = r + " reps";
    tdWeight.textContent = roundedWeight.toFixed(1) + " kg";

    tr.appendChild(tdReps);
    tr.appendChild(tdWeight);
    repmaxBody.appendChild(tr);
  }
});
