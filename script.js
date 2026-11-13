/* =========================================================
   Graphing Coach — Guided Practice
   Learners choose a graph type, assign variables to axes,
   place every point/bar themselves by reading the scale,
   and then interpret the finished graph.
   ========================================================= */

const graphTypeOptions = ["Bar Graph", "Line Graph", "Scatter Plot"];

const datasetTemplates = {
  bar1: {
    id: "bar1",
    title: "Dataset 1",
    prompt:
      "Students grew plants with four different fertilizers and measured the average height of each group after three weeks. Which graph type fits best, and how should it be built?",
    graphType: "Bar Graph",
    variables: ["Fertilizer Type", "Average Plant Height (cm)"],
    xVar: "Fertilizer Type",
    yVar: "Average Plant Height (cm)",
    variableInfo: {
      "Fertilizer Type": { role: "independent", note: "the groups the students chose to compare" },
      "Average Plant Height (cm)": { role: "dependent", note: "the result that was measured" }
    },
    headers: ["Fertilizer Type", "Average Plant Height (cm)"],
    categories: ["Fertilizer A", "Fertilizer B", "Fertilizer C", "Fertilizer D"],
    graphTypeFeedback: {
      "Bar Graph":
        "Correct. Fertilizer type is categorical (separate groups with labels, not numbers), so a bar graph compares the groups. The graph frame is now revealed.",
      "Line Graph":
        "Fertilizer A, B, C, and D are labels, not points on a number scale. There is nothing \"between\" Fertilizer A and B, so a connecting line would suggest a trend that doesn't exist.",
      "Scatter Plot":
        "A scatter plot needs numbers on both axes. Fertilizer type is a category, so there is no numerical x-scale to plot against."
    },
    buildSteps: [
      "Choose the graph type that fits the data.",
      "Put the independent variable (what was changed or grouped) on the x-axis.",
      "Put the dependent variable (what was measured) on the y-axis.",
      "Click in each fertilizer's column at the height shown in the table. Each small gridline is 1 cm, and bar heights must match exactly.",
      "Click a column again to change its height, then press Check Graph."
    ],
    graph: {
      kind: "bar",
      yMin: 0,
      yMax: 20,
      yStep: 5,
      yMinor: 1,
      ySnap: 1,
      yTol: 0,
      yUnit: "cm"
    }
  },

  line1: {
    id: "line1",
    title: "Dataset 2",
    prompt:
      "A beaker of hot water was left to cool, and its temperature was recorded every 2 minutes. Which graph type fits best, and how should it be built?",
    graphType: "Line Graph",
    variables: ["Time (min)", "Water Temperature (°C)"],
    xVar: "Time (min)",
    yVar: "Water Temperature (°C)",
    variableInfo: {
      "Time (min)": { role: "independent", note: "the times chosen for each measurement" },
      "Water Temperature (°C)": { role: "dependent", note: "the result that was measured at each time" }
    },
    headers: ["Time (min)", "Water Temperature (°C)"],
    xValues: [0, 2, 4, 6, 8],
    graphTypeFeedback: {
      "Line Graph":
        "Correct. These measurements follow one water sample in time order, so connecting the points shows how the temperature changed. The graph frame is now revealed.",
      "Bar Graph":
        "Time is a numerical scale, not a set of separate categories. Bars would hide how the temperature changes from one moment to the next.",
      "Scatter Plot":
        "A scatter plot could display these points, but this data follows one water sample over time, and each time has exactly one temperature. Connecting the points in order shows the change more clearly. Which graph type does that?"
    },
    buildSteps: [
      "Choose the graph type that fits the data.",
      "Put the independent variable (what was chosen or changed) on the x-axis.",
      "Put the dependent variable (what was measured) on the y-axis.",
      "Plot each (time, temperature) pair. Each small gridline is 1 min across and 5 °C up.",
      "Points within ±2 °C of the table value count as accurate. Click a point again to remove it.",
      "When all points are correct, Check Graph connects them in time order."
    ],
    explanation:
      "A line graph fits because the same water sample was measured again and again as time passed. Each time has exactly one temperature, and the water kept cooling between measurements, so connecting the points in order shows the trend. Both variables are numerical, but that alone doesn't decide the graph type. A line works here because the points form an ordered sequence of one changing quantity.",
    graph: {
      kind: "line",
      xMin: 0,
      xMax: 8,
      xStep: 2,
      xMinor: 1,
      xSnap: 1,
      xTol: 0,
      xUnit: "min",
      yMin: 0,
      yMax: 100,
      yStep: 20,
      yMinor: 5,
      ySnap: 1,
      yTol: 2,
      yUnit: "°C"
    }
  },

  scatter1: {
    id: "scatter1",
    title: "Dataset 3",
    prompt:
      "Students rolled a ball down a ramp set to different heights and measured how far it traveled. Each row is a separate trial. Which graph type fits best, and how should it be built?",
    graphType: "Scatter Plot",
    variables: ["Ramp Height (cm)", "Distance Traveled (cm)"],
    xVar: "Ramp Height (cm)",
    yVar: "Distance Traveled (cm)",
    variableInfo: {
      "Ramp Height (cm)": { role: "independent", note: "the setting the students changed for each trial" },
      "Distance Traveled (cm)": { role: "dependent", note: "the result that was measured in each trial" }
    },
    headers: ["Trial", "Ramp Height (cm)", "Distance Traveled (cm)"],
    graphTypeFeedback: {
      "Scatter Plot":
        "Correct. Each trial is a separate observation of two numerical variables, so plotting individual points lets you look for a relationship. The graph frame is now revealed.",
      "Bar Graph":
        "Both variables are numerical measurements, not categories. A bar graph would treat each ramp height as a separate label and hide the overall relationship.",
      "Line Graph":
        "Look closely at the table: each row is a separate trial, and one ramp height was tested twice with different results. A line connecting the points would draw a path that the data doesn't show."
    },
    buildSteps: [
      "Choose the graph type that fits the data.",
      "Put the independent variable (what was changed) on the x-axis.",
      "Put the dependent variable (what was measured) on the y-axis.",
      "Plot one point for every trial, including both trials at the same ramp height. Each small gridline is 1 cm across and 10 cm up.",
      "Points within ±4 cm of the table value count as accurate. Click a point again to remove it.",
      "Press Check Graph when every trial is plotted."
    ],
    graph: {
      kind: "scatter",
      xMin: 0,
      xMax: 30,
      xStep: 5,
      xMinor: 1,
      xSnap: 1,
      xTol: 0,
      xUnit: "cm",
      yMin: 0,
      yMax: 160,
      yStep: 40,
      yMinor: 10,
      ySnap: 1,
      yTol: 4,
      yUnit: "cm"
    }
  }
};

/* ---------- Small helpers ---------- */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function tidy(value) {
  return Number(value.toFixed(6));
}

function snapTo(value, step) {
  return tidy(Math.round(value / step) * step);
}

function approxEqual(a, b, tol = 0.051) {
  return Math.abs(a - b) <= tol;
}

function formatNumber(value) {
  return String(tidy(value)).replace("-", "−");
}

function forEachStep(min, max, step, fn) {
  const count = Math.round((max - min) / step);
  for (let i = 0; i <= count; i++) {
    fn(tidy(min + i * step));
  }
}

function isMultiple(value, step) {
  const ratio = value / step;
  return Math.abs(ratio - Math.round(ratio)) < 1e-6;
}

function parseAnswer(raw) {
  const cleaned = String(raw).replace(/[−–—]/g, "-").replace(/,/g, "");
  const match = cleaned.match(/-?\d*\.?\d+/);
  return match ? Number(match[0]) : NaN;
}

function linearFit(points) {
  const n = points.length;
  const meanX = points.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;
  let sxy = 0;
  let sxx = 0;
  points.forEach(p => {
    sxy += (p.x - meanX) * (p.y - meanY);
    sxx += (p.x - meanX) ** 2;
  });
  const slope = sxy / sxx;
  return { slope, intercept: meanY - slope * meanX };
}

/* ---------- Data generation ---------- */

function generateBarValues() {
  // Four different whole-number heights from 5 to 19 cm, so there is always one tallest and one shortest bar.
  return shuffle(Array.from({ length: 15 }, (_, i) => i + 5)).slice(0, 4);
}

function generateLinePoints() {
  const xValues = datasetTemplates.line1.xValues;

  for (let attempt = 0; attempt < 500; attempt++) {
    const start = randomInt(86, 96);
    const drops = [randomInt(7, 11), randomInt(6, 10), randomInt(5, 9), randomInt(4, 8)];
    const biggest = Math.max(...drops);
    const total = drops.reduce((sum, d) => sum + d, 0);

    // One clearly steepest interval, and a total drop that gives a clean average rate (multiple of 0.5).
    if (drops.filter(d => d === biggest).length !== 1) continue;
    if (total % 4 !== 0) continue;

    const yValues = [start];
    drops.forEach(drop => yValues.push(yValues[yValues.length - 1] - drop));
    return xValues.map((x, index) => ({ x, y: yValues[index] }));
  }

  return [
    { x: 0, y: 92 },
    { x: 2, y: 82 },
    { x: 4, y: 74 },
    { x: 6, y: 67 },
    { x: 8, y: 60 }
  ];
}

function generateScatterPoints() {
  // Separate trials with some natural variation. One ramp height is repeated,
  // and 20 cm is never tested so it can be used for a prediction question.
  const pool = [6, 8, 10, 12, 14, 16, 18, 22, 24, 26, 28, 30];
  let xs;
  do {
    xs = shuffle(pool).slice(0, 6);
  } while (Math.min(...xs) > 10 || Math.max(...xs) < 26);

  const intercept = randomInt(10, 20);
  const slope = randomInt(35, 42) / 10;
  const keepInRange = value => clamp(value, 5, 155);

  const points = xs.map(x => ({
    x,
    y: keepInRange(Math.round(intercept + slope * x + randomInt(-8, 8)))
  }));

  const repeated = points[randomInt(0, points.length - 1)];
  const offset = randomInt(10, 16) * (repeated.y > 110 ? -1 : 1);
  points.push({ x: repeated.x, y: keepInRange(repeated.y + offset) });

  return { points: shuffle(points), repeatedX: repeated.x };
}

/* ---------- Interpretation challenges ---------- */

function buildBarChallenge(ds) {
  const { categories, values } = ds.graph;
  const maxIndex = values.indexOf(Math.max(...values));
  const minIndex = values.indexOf(Math.min(...values));
  const maxName = categories[maxIndex];
  const minName = categories[minIndex];
  const difference = values[maxIndex] - values[minIndex];

  return [
    {
      type: "mc",
      prompt: "According to your graph, which fertilizer produced the greatest average plant height?",
      options: [...categories],
      evaluate(choice) {
        if (choice === maxName) {
          return {
            correct: true,
            message: `Correct. ${maxName} has the tallest bar, reaching ${values[maxIndex]} cm.`
          };
        }
        if (choice === minName) {
          return {
            correct: false,
            message: "That is the shortest bar. The greatest value is shown by the bar that reaches highest on the y-axis."
          };
        }
        return {
          correct: false,
          message: "Compare the tops of all four bars. Which one reaches highest on the y-axis?"
        };
      }
    },
    {
      type: "num",
      prompt: `How many centimeters greater is the average height with ${maxName} than with ${minName} (the shortest bar)?`,
      unit: "cm",
      evaluate(value) {
        if (approxEqual(value, difference)) {
          return {
            correct: true,
            message: `Correct. ${values[maxIndex]} − ${values[minIndex]} = ${difference} cm. Comparing bar heights by subtraction tells you how much greater one group is.`
          };
        }
        if (approxEqual(value, -difference)) {
          return {
            correct: false,
            message: "The size of your answer is right, but the question asks how much greater, so subtract the shorter bar from the taller one."
          };
        }
        if (approxEqual(value, values[maxIndex]) || approxEqual(value, values[minIndex])) {
          return {
            correct: false,
            message: "That is the height of just one bar. Find the difference: taller bar − shorter bar."
          };
        }
        return {
          correct: false,
          message: `Read both bar heights from the y-axis (each small gridline is 1 cm), then subtract: ${maxName} − ${minName}.`
        };
      }
    }
  ];
}

function buildLineChallenge(ds) {
  const pts = ds.graph.points;
  const drops = pts.slice(1).map((p, i) => pts[i].y - p.y);
  const steepest = drops.indexOf(Math.max(...drops));
  const flattest = drops.indexOf(Math.min(...drops));
  const intervals = pts.slice(1).map((p, i) => `${pts[i].x}–${p.x} min`);
  const first = pts[0];
  const last = pts[pts.length - 1];
  const change = last.y - first.y;
  const elapsed = last.x - first.x;
  const rate = change / elapsed;

  return [
    {
      type: "mc",
      prompt: "During which 2-minute interval did the water temperature drop the most?",
      options: intervals,
      evaluate(choice) {
        if (choice === intervals[steepest]) {
          return {
            correct: true,
            message: `Correct. The temperature fell ${drops[steepest]} °C from ${pts[steepest].x} to ${pts[steepest + 1].x} min, the steepest part of the line.`
          };
        }
        if (choice === intervals[flattest]) {
          return {
            correct: false,
            message: "That segment is the least steep, so the temperature changed the least there. Look for the steepest downward segment."
          };
        }
        return {
          correct: false,
          message: "Compare how steep each segment is, not how high it sits. You can check by subtracting the temperatures at each end of every interval."
        };
      }
    },
    {
      type: "num",
      prompt: `What was the average rate of change in temperature from ${first.x} to ${last.x} minutes? Answer in °C per minute.`,
      unit: "°C/min",
      evaluate(value) {
        if (approxEqual(value, rate)) {
          return {
            correct: true,
            message: `Correct. (${last.y} − ${first.y}) ÷ (${last.x} − ${first.x}) = ${formatNumber(rate)} °C/min. The negative sign shows the water was cooling. Because the line gets less steep over time, this is an average: the actual drop each minute was not constant.`
          };
        }
        if (approxEqual(value, -rate)) {
          return {
            correct: false,
            message: "The size is right, but check the sign. The temperature is decreasing, so the rate of change is negative."
          };
        }
        if (approxEqual(Math.abs(value), Math.abs(change))) {
          return {
            correct: false,
            message: `That is the total change in temperature. Rate of change = change in temperature ÷ change in time (${elapsed} minutes).`
          };
        }
        if (approxEqual(Math.abs(value), Math.abs(change / (pts.length - 1)))) {
          return {
            correct: false,
            message: `You divided by the number of intervals (${pts.length - 1}). Divide by the elapsed time instead: ${last.x} − ${first.x} = ${elapsed} minutes.`
          };
        }
        if (approxEqual(Math.abs(value), Math.abs(change / pts.length))) {
          return {
            correct: false,
            message: `You divided by the number of measurements (${pts.length}). Divide by the elapsed time instead: ${last.x} − ${first.x} = ${elapsed} minutes.`
          };
        }
        if (approxEqual(Math.abs(value), Math.abs(elapsed / change), 0.01)) {
          return {
            correct: false,
            message: "It looks like you divided time by temperature. Rate of change = change in temperature ÷ change in time."
          };
        }
        return {
          correct: false,
          message: "Use rate of change = (final temperature − initial temperature) ÷ (final time − initial time). Read the first and last points on your graph."
        };
      }
    }
  ];
}

function buildScatterChallenge(ds) {
  const fit = linearFit(ds.graph.points);
  const predictX = 20;
  const predicted = fit.intercept + fit.slope * predictX;
  const low = Math.floor(predicted - 12);
  const high = Math.ceil(predicted + 12);

  return [
    {
      type: "mc",
      prompt: "What relationship does your scatter plot show between ramp height and distance traveled?",
      options: [
        "Positive: distance tends to increase as ramp height increases",
        "Negative: distance tends to decrease as ramp height increases",
        "No clear relationship"
      ],
      evaluate(choice) {
        if (choice.startsWith("Positive")) {
          return {
            correct: true,
            message: `Correct. The points rise from left to right. The two trials at ${ds.repeatedX} cm landed at different distances, because real data varies. Look for the overall trend, not a perfect pattern.`
          };
        }
        if (choice.startsWith("Negative")) {
          return {
            correct: false,
            message: "Read the points from left to right, from low ramps to high ramps. Do the distances tend to go up or down?"
          };
        }
        return {
          correct: false,
          message: "The points don't fall on a perfect line, but there is still a clear overall trend. Compare the trials with the lowest ramps to the trials with the highest ramps."
        };
      }
    },
    {
      type: "num",
      prompt: `No trial used a ${predictX} cm ramp. Based on the trend in your scatter plot, predict the distance traveled for a ${predictX} cm ramp.`,
      unit: "cm",
      evaluate(value) {
        if (value >= low && value <= high) {
          return {
            correct: true,
            message: `Reasonable prediction. The trend suggests about ${Math.round(predicted)} cm, and any estimate from ${low} to ${high} cm fits the pattern. A prediction made from a trend always carries some uncertainty.`
          };
        }
        if (approxEqual(value, predictX)) {
          return {
            correct: false,
            message: `${predictX} cm is the ramp height (x-value). Your answer should be a distance read from the y-axis.`
          };
        }
        return {
          correct: false,
          message: `That is ${value < low ? "lower" : "higher"} than the trend suggests. Find ${predictX} cm on the x-axis, then look at the trials just below and just above it. Where would the overall pattern of points cross ${predictX} cm?`
        };
      }
    }
  ];
}

/* ---------- Dataset assembly ---------- */

function buildDatasetFromTemplate(templateKey) {
  const template = datasetTemplates[templateKey];

  if (templateKey === "bar1") {
    const values = generateBarValues();
    const ds = {
      ...template,
      rows: template.categories.map((category, index) => [category, String(values[index])]),
      explanation:
        "A bar graph fits because fertilizer type is categorical: A, B, C, and D are separate groups with no order or in-between values. Each bar's height shows the measured value for one group. The y-axis starts at 0 so the bar heights can be compared fairly.",
      graph: { ...template.graph, categories: [...template.categories], values }
    };
    ds.challenge = buildBarChallenge(ds);
    return ds;
  }

  if (templateKey === "line1") {
    const points = generateLinePoints();
    const ds = {
      ...template,
      rows: points.map(point => [String(point.x), String(point.y)]),
      graph: { ...template.graph, points }
    };
    ds.challenge = buildLineChallenge(ds);
    return ds;
  }

  if (templateKey === "scatter1") {
    const { points, repeatedX } = generateScatterPoints();
    const ds = {
      ...template,
      repeatedX,
      rows: points.map((point, index) => [String(index + 1), String(point.x), String(point.y)]),
      explanation:
        `A scatter plot fits because each row is a separate trial, and the ${repeatedX} cm ramp was tested twice with different results. Plotting individual points shows the overall relationship without implying a path from one trial to the next. If you averaged the trials at each height and graphed the averages, a line graph could also be reasonable. The best choice depends on what the data represent, not only on whether the variables are numerical.`,
      graph: { ...template.graph, points }
    };
    ds.challenge = buildScatterChallenge(ds);
    return ds;
  }

  return null;
}

let datasets = {
  bar1: buildDatasetFromTemplate("bar1"),
  line1: buildDatasetFromTemplate("line1"),
  scatter1: buildDatasetFromTemplate("scatter1")
};

/* ---------- DOM references ---------- */

const svg = document.getElementById("graphSvg");
const datasetButtons = document.getElementById("datasetButtons");
const datasetTitle = document.getElementById("datasetTitle");
const datasetPrompt = document.getElementById("datasetPrompt");
const dataTable = document.getElementById("dataTable");
const graphTypeChoices = document.getElementById("graphTypeChoices");
const xAxisChoices = document.getElementById("xAxisChoices");
const yAxisChoices = document.getElementById("yAxisChoices");
const feedback = document.getElementById("feedback");
const howToList = document.getElementById("howToList");
const checkGraphBtn = document.getElementById("checkGraphBtn");
const resetGraphBtn = document.getElementById("resetGraphBtn");
const generateDatasetBtn = document.getElementById("generateDatasetBtn");
const explanationText = document.getElementById("explanationText");
const graphStatus = document.getElementById("graphStatus");

const challengeCard = document.getElementById("challengeCard");
const challengeProgress = document.getElementById("challengeProgress");
const challengePrompt = document.getElementById("challengePrompt");
const challengeChoices = document.getElementById("challengeChoices");
const challengeNumeric = document.getElementById("challengeNumeric");
const challengeInput = document.getElementById("challengeInput");
const challengeUnit = document.getElementById("challengeUnit");
const challengeSubmit = document.getElementById("challengeSubmit");
const challengeFeedback = document.getElementById("challengeFeedback");
const challengeNextBtn = document.getElementById("challengeNextBtn");

const svgNS = "http://www.w3.org/2000/svg";

let currentKey = "bar1";
let state = {};
let pointId = 0;

// Drawing space (matches the SVG viewBox). The plot fills most of it so learners have room to place points precisely.
const VIEW_W = 760;
const VIEW_H = 600;

const plotArea = {
  left: 92,
  top: 28,
  width: 640,
  height: 492
};

/* ---------- State & feedback ---------- */

function resetState() {
  state = {
    graphTypeChoice: null,
    xChoice: null,
    yChoice: null,
    placedBars: {},
    placedPoints: [],
    graphCheckedCorrect: false,
    wrongBars: new Set(),
    wrongPoints: new Set(),
    hover: null,
    cursor: null,
    keyboardActive: false,
    challengeIndex: 0
  };
}

function resetExplanation() {
  explanationText.textContent = "Check a completed graph to see an explanation here.";
}

function showExplanation(ds) {
  explanationText.textContent = ds.explanation;
}

function writeFeedback(target, message, type = "", category = "") {
  target.textContent = "";
  target.className = `feedback ${type}`.trim();
  if (category) {
    const tag = document.createElement("span");
    tag.className = "feedback-tag";
    tag.textContent = category;
    target.appendChild(tag);
  }
  target.appendChild(document.createTextNode(message));
}

function setFeedback(message, type = "", category = "") {
  writeFeedback(feedback, message, type, category);
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.className = "feedback";
}

function announce(message) {
  graphStatus.textContent = message;
}

/* ---------- Left panel rendering ---------- */

function initDatasetButtons() {
  datasetButtons.innerHTML = "";
  Object.values(datasets).forEach(ds => {
    const btn = document.createElement("button");
    btn.className = `dataset-btn ${ds.id === currentKey ? "active" : ""}`;
    btn.textContent = ds.title;
    btn.type = "button";
    btn.setAttribute("aria-pressed", ds.id === currentKey ? "true" : "false");
    btn.addEventListener("click", () => {
      currentKey = ds.id;
      loadDataset();
    });
    datasetButtons.appendChild(btn);
  });
}

function renderTable(ds) {
  dataTable.innerHTML = "";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ds.headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    th.scope = "col";
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  dataTable.appendChild(thead);

  const tbody = document.createElement("tbody");
  ds.rows.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  dataTable.appendChild(tbody);
}

function renderBuildSteps(ds) {
  howToList.innerHTML = "";
  ds.buildSteps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    howToList.appendChild(li);
  });
}

function renderChoiceButtons(container, options, selectedValue, handler) {
  container.innerHTML = "";
  container.className = "choice-group";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = `choice-btn ${selectedValue === option ? "active" : ""}`;
    btn.textContent = option;
    btn.type = "button";
    btn.setAttribute("aria-pressed", selectedValue === option ? "true" : "false");
    btn.addEventListener("click", () => handler(option));
    container.appendChild(btn);
  });
}

function axisFeedback(ds, axis, choice) {
  const correctVar = axis === "x" ? ds.xVar : ds.yVar;
  const otherChoice = axis === "x" ? state.yChoice : state.xChoice;
  const info = ds.variableInfo[choice];

  if (choice === correctVar) {
    let message =
      axis === "x"
        ? `Correct. ${choice} is the independent variable (${info.note}), so it goes on the x-axis.`
        : `Correct. ${choice} is the dependent variable (${info.note}), so it goes on the y-axis.`;
    if (otherChoice === choice) {
      message += " Each axis needs a different variable, so update the other axis too.";
    }
    return { message, type: "good" };
  }

  const message =
    axis === "x"
      ? `${choice} is the ${info.role} variable: ${info.note}. The x-axis is for the independent variable, the one that was chosen or changed.`
      : `${choice} is the ${info.role} variable: ${info.note}. The y-axis is for the dependent variable, the result that was measured.`;
  return { message, type: "bad" };
}

function renderAllChoices(ds) {
  renderChoiceButtons(graphTypeChoices, graphTypeOptions, state.graphTypeChoice, choice => {
    if (state.graphCheckedCorrect) return lockedMessage();
    state.graphTypeChoice = choice;
    setFeedback(ds.graphTypeFeedback[choice], choice === ds.graphType ? "good" : "bad", "Graph choice");
    redrawGraph();
    renderAllChoices(ds);
  });

  renderChoiceButtons(xAxisChoices, ds.variables, state.xChoice, choice => {
    if (state.graphCheckedCorrect) return lockedMessage();
    state.xChoice = choice;
    const result = axisFeedback(ds, "x", choice);
    setFeedback(result.message, result.type, "Variables");
    redrawGraph();
    renderAllChoices(ds);
  });

  renderChoiceButtons(yAxisChoices, ds.variables, state.yChoice, choice => {
    if (state.graphCheckedCorrect) return lockedMessage();
    state.yChoice = choice;
    const result = axisFeedback(ds, "y", choice);
    setFeedback(result.message, result.type, "Variables");
    redrawGraph();
    renderAllChoices(ds);
  });
}

function lockedMessage() {
  setFeedback(
    "Your graph is complete. Answer the questions below the graph, or press Reset Graph to rebuild it.",
    "",
    "Graph complete"
  );
}

function graphTypeIsCorrect(ds) {
  return state.graphTypeChoice === ds.graphType;
}

function axesAreCorrect(ds) {
  return state.xChoice === ds.xVar && state.yChoice === ds.yVar;
}

function choicesAreCorrect(ds) {
  return graphTypeIsCorrect(ds) && axesAreCorrect(ds);
}

function readyToBuild(ds) {
  return choicesAreCorrect(ds) && !state.graphCheckedCorrect;
}

/* ---------- SVG drawing ---------- */

function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function clearSvg() {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}

function drawText(x, y, text, size = 14, weight = "normal", fill = "#334155", anchor = "start", parent = svg) {
  const t = createSvgElement("text", {
    x,
    y,
    fill,
    "font-size": size,
    "font-weight": weight,
    "font-family": "Arial, Helvetica, sans-serif",
    "text-anchor": anchor
  });
  t.textContent = text;
  parent.appendChild(t);
  return t;
}

function drawLockedPrompt() {
  clearSvg();

  svg.appendChild(createSvgElement("rect", { x: 0, y: 0, width: VIEW_W, height: VIEW_H, fill: "white" }));
  svg.appendChild(
    createSvgElement("rect", {
      x: VIEW_W / 2 - 280,
      y: VIEW_H / 2 - 110,
      width: 560,
      height: 200,
      rx: 22,
      fill: "#f7f9ff",
      stroke: "#dbe6f2",
      "stroke-width": 2
    })
  );

  drawText(VIEW_W / 2, VIEW_H / 2 - 45, "Complete Step 1 First", 30, "bold", "#6c63ff", "middle");
  drawText(VIEW_W / 2, VIEW_H / 2 - 5, "Choose the correct graph type to reveal the graph frame.", 18, "normal", "#4b5563", "middle");
  drawText(VIEW_W / 2, VIEW_H / 2 + 30, "Variable labels will appear after Steps 2 and 3 are correct.", 18, "normal", "#4b5563", "middle");
}

function valueToY(ds, value) {
  const graph = ds.graph;
  const yMin = graph.yMin || 0;
  const proportion = (value - yMin) / (graph.yMax - yMin);
  return plotArea.top + plotArea.height - proportion * plotArea.height;
}

function valueToX(ds, value) {
  const graph = ds.graph;
  const proportion = (value - graph.xMin) / (graph.xMax - graph.xMin);
  return plotArea.left + proportion * plotArea.width;
}

function yToValue(ds, y) {
  const graph = ds.graph;
  const yMin = graph.yMin || 0;
  return yMin + ((plotArea.top + plotArea.height - y) / plotArea.height) * (graph.yMax - yMin);
}

function xToValue(ds, x) {
  const graph = ds.graph;
  return graph.xMin + ((x - plotArea.left) / plotArea.width) * (graph.xMax - graph.xMin);
}

function drawGridlines(ds) {
  const graph = ds.graph;
  const yMin = graph.yMin || 0;

  forEachStep(yMin, graph.yMax, graph.yMinor || graph.yStep, value => {
    if (value === yMin) return;
    const y = valueToY(ds, value);
    const major = isMultiple(value - yMin, graph.yStep);
    svg.appendChild(
      createSvgElement("line", {
        x1: plotArea.left,
        y1: y,
        x2: plotArea.left + plotArea.width,
        y2: y,
        stroke: major ? "#d5e0ee" : "#eef2f8",
        "stroke-width": 1
      })
    );
  });

  if (graph.kind === "bar") return;

  forEachStep(graph.xMin, graph.xMax, graph.xMinor || graph.xStep, value => {
    if (value === graph.xMin) return;
    const x = valueToX(ds, value);
    const major = isMultiple(value - graph.xMin, graph.xStep);
    svg.appendChild(
      createSvgElement("line", {
        x1: x,
        y1: plotArea.top,
        x2: x,
        y2: plotArea.top + plotArea.height,
        stroke: major ? "#d5e0ee" : "#eef2f8",
        "stroke-width": 1
      })
    );
  });
}

function drawBaseAxes(ds) {
  clearSvg();
  svg.appendChild(createSvgElement("rect", { x: 0, y: 0, width: VIEW_W, height: VIEW_H, fill: "white" }));

  const graph = ds.graph;
  drawGridlines(ds);

  svg.appendChild(
    createSvgElement("line", {
      x1: plotArea.left,
      y1: plotArea.top,
      x2: plotArea.left,
      y2: plotArea.top + plotArea.height,
      stroke: "#334155",
      "stroke-width": 2
    })
  );

  svg.appendChild(
    createSvgElement("line", {
      x1: plotArea.left,
      y1: plotArea.top + plotArea.height,
      x2: plotArea.left + plotArea.width,
      y2: plotArea.top + plotArea.height,
      stroke: "#334155",
      "stroke-width": 2
    })
  );

  forEachStep(graph.yMin || 0, graph.yMax, graph.yStep, value => {
    const y = valueToY(ds, value);
    drawText(plotArea.left - 12, y + 6, String(value), 17, "bold", "#334155", "end");
  });

  if (axesAreCorrect(ds)) {
    drawText(
      plotArea.left + plotArea.width - 10,
      plotArea.top + plotArea.height + 56,
      ds.xVar,
      18,
      "bold",
      "#334155",
      "end"
    );

    const yLabel = createSvgElement("text", {
      x: 28,
      y: plotArea.top + plotArea.height / 2,
      fill: "#334155",
      "font-size": 18,
      "font-weight": "bold",
      "font-family": "Arial, Helvetica, sans-serif",
      transform: `rotate(-90 28 ${plotArea.top + plotArea.height / 2})`,
      "text-anchor": "middle"
    });
    yLabel.textContent = ds.yVar;
    svg.appendChild(yLabel);
  }
}

function drawBarFrame(ds) {
  drawBaseAxes(ds);

  const categories = ds.graph.categories;
  const slotWidth = plotArea.width / categories.length;

  categories.forEach((category, index) => {
    const centerX = plotArea.left + slotWidth * index + slotWidth / 2;

    drawText(
      centerX,
      plotArea.top + plotArea.height + 26,
      category.replace("Fertilizer ", ""),
      18,
      "bold",
      "#334155",
      "middle"
    );

    svg.appendChild(
      createSvgElement("rect", {
        x: plotArea.left + slotWidth * index + 18,
        y: plotArea.top,
        width: slotWidth - 36,
        height: plotArea.height,
        fill: "rgba(239, 71, 111, 0.05)",
        stroke: "rgba(239, 71, 111, 0.12)"
      })
    );
  });
}

function drawPlacedBars(ds) {
  const categories = ds.graph.categories;
  const slotWidth = plotArea.width / categories.length;

  Object.entries(state.placedBars).forEach(([indexString, value]) => {
    const index = Number(indexString);
    const x = plotArea.left + slotWidth * index + 30;
    const width = slotWidth - 60;
    const y = valueToY(ds, value);
    const height = plotArea.top + plotArea.height - y;
    const wrong = state.wrongBars.has(index);

    svg.appendChild(
      createSvgElement("rect", {
        x,
        y,
        width,
        height,
        fill: "#ef476f",
        stroke: wrong ? "#d64545" : "none",
        "stroke-width": wrong ? 3 : 0,
        "stroke-dasharray": wrong ? "6 4" : "none",
        "fill-opacity": wrong ? 0.55 : 1
      })
    );

    if (wrong) {
      drawText(x + width / 2, y - 8, "Check", 13, "bold", "#d64545", "middle");
    }

    // Values appear only once the graph is correct, so learners must read the scale themselves.
    if (state.graphCheckedCorrect) {
      drawText(x + width / 2, y - 10, String(value), 18, "bold", "#ef476f", "middle");
    }
  });
}

function drawLineOrScatterFrame(ds) {
  drawBaseAxes(ds);

  const graph = ds.graph;
  forEachStep(graph.xMin, graph.xMax, graph.xStep, value => {
    const x = valueToX(ds, value);
    drawText(x, plotArea.top + plotArea.height + 26, String(value), 17, "bold", "#334155", "middle");
  });
}

function drawPlacedPoints(ds) {
  const graph = ds.graph;
  const color = graph.kind === "line" ? "#6c63ff" : "#00bcd4";

  if (graph.kind === "line" && state.graphCheckedCorrect && state.placedPoints.length) {
    const sorted = [...state.placedPoints].sort((a, b) => a.x - b.x);
    svg.appendChild(
      createSvgElement("polyline", {
        points: sorted.map(p => `${valueToX(ds, p.x)},${valueToY(ds, p.y)}`).join(" "),
        fill: "none",
        stroke: "#6c63ff",
        "stroke-width": 3
      })
    );
  }

  state.placedPoints.forEach(point => {
    const cx = valueToX(ds, point.x);
    const cy = valueToY(ds, point.y);

    if (state.wrongPoints.has(point.id)) {
      svg.appendChild(
        createSvgElement("circle", {
          cx,
          cy,
          r: 12,
          fill: "none",
          stroke: "#d64545",
          "stroke-width": 2.5,
          "stroke-dasharray": "4 3"
        })
      );
    }

    svg.appendChild(createSvgElement("circle", { cx, cy, r: 6, fill: color }));

    if (state.graphCheckedCorrect && graph.kind === "line") {
      drawText(cx + 10, cy - 12, `(${point.x}, ${point.y})`, 15, "bold", color, "start");
    }
  });
}

function drawOverlay() {
  const old = document.getElementById("graphOverlay");
  if (old) old.remove();

  const ds = datasets[currentKey];
  if (!readyToBuild(ds)) return;

  const pos = state.keyboardActive ? state.cursor : state.hover;
  if (!pos) return;

  const group = createSvgElement("g", { id: "graphOverlay", "pointer-events": "none" });
  const guideColor = state.keyboardActive ? "#ffb703" : "#94a3b8";
  const y = valueToY(ds, pos.y);

  if (ds.graph.kind === "bar") {
    const slotWidth = plotArea.width / ds.graph.categories.length;
    const left = plotArea.left + slotWidth * pos.index + 18;

    group.appendChild(
      createSvgElement("line", {
        x1: plotArea.left,
        y1: y,
        x2: left + slotWidth - 36,
        y2: y,
        stroke: guideColor,
        "stroke-width": 2,
        "stroke-dasharray": "5 4"
      })
    );

    if (state.keyboardActive) {
      group.appendChild(
        createSvgElement("rect", {
          x: left,
          y: plotArea.top,
          width: slotWidth - 36,
          height: plotArea.height,
          fill: "none",
          stroke: "#ffb703",
          "stroke-width": 2
        })
      );
    }
  } else {
    const x = valueToX(ds, pos.x);
    const lineAttrs = { stroke: guideColor, "stroke-width": 1.5, "stroke-dasharray": "5 4" };

    group.appendChild(
      createSvgElement("line", { x1: plotArea.left, y1: y, x2: x, y2: y, ...lineAttrs })
    );
    group.appendChild(
      createSvgElement("line", { x1: x, y1: y, x2: x, y2: plotArea.top + plotArea.height, ...lineAttrs })
    );
    group.appendChild(
      createSvgElement("circle", {
        cx: x,
        cy: y,
        r: 7,
        fill: "none",
        stroke: state.keyboardActive ? "#ffb703" : "#64748b",
        "stroke-width": 2
      })
    );
  }

  svg.appendChild(group);
}

function redrawGraph() {
  const ds = datasets[currentKey];
  svg.classList.toggle("building", readyToBuild(ds));

  if (!graphTypeIsCorrect(ds)) {
    drawLockedPrompt();
    return;
  }

  if (ds.graph.kind === "bar") {
    drawBarFrame(ds);
    drawPlacedBars(ds);
  } else {
    drawLineOrScatterFrame(ds);
    drawPlacedPoints(ds);
  }

  drawOverlay();
}

/* ---------- Loading datasets ---------- */

function showDataset(message) {
  const ds = datasets[currentKey];
  resetState();
  initDatasetButtons();
  renderTable(ds);
  renderBuildSteps(ds);
  renderAllChoices(ds);
  redrawGraph();
  resetExplanation();
  hideChallenge();
  announce("");
  datasetTitle.textContent = ds.title;
  datasetPrompt.textContent = ds.prompt;
  setFeedback(message, "");
}

function loadDataset() {
  showDataset("Use the data table to decide the graph type first.");
}

function regenerateCurrentDataset() {
  datasets[currentKey] = buildDatasetFromTemplate(currentKey);
  showDataset("New numbers generated. Start with Step 1: choose the graph type.");
}

/* ---------- Placing points and bars ---------- */

function getClickCoordinates(evt) {
  const rect = svg.getBoundingClientRect();
  const scaleX = VIEW_W / rect.width;
  const scaleY = VIEW_H / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

function nearPlotArea(x, y, margin = 14) {
  return (
    x >= plotArea.left - margin &&
    x <= plotArea.left + plotArea.width + margin &&
    y >= plotArea.top - margin &&
    y <= plotArea.top + plotArea.height + margin
  );
}

// Converts an SVG position to the nearest gridded data position (never to the answer).
function svgToData(ds, x, y) {
  const graph = ds.graph;
  const yValue = clamp(snapTo(yToValue(ds, y), graph.ySnap), graph.yMin || 0, graph.yMax);

  if (graph.kind === "bar") {
    const slotWidth = plotArea.width / graph.categories.length;
    const index = Math.floor((x - plotArea.left) / slotWidth);
    if (index < 0 || index >= graph.categories.length) return null;
    return { index, y: yValue };
  }

  return {
    x: clamp(snapTo(xToValue(ds, x), graph.xSnap), graph.xMin, graph.xMax),
    y: yValue
  };
}

function clearCheckMarks() {
  state.wrongBars = new Set();
  state.wrongPoints = new Set();
}

function setBar(ds, index, value) {
  state.placedBars[index] = value;
  clearCheckMarks();
  redrawGraph();
  const placed = Object.keys(state.placedBars).length;
  const total = ds.graph.categories.length;
  setFeedback(
    `Bar set for ${ds.graph.categories[index]}. ${placed} of ${total} bars built.`,
    "",
    "Placement"
  );
  announce(`Bar for ${ds.graph.categories[index]} set to ${value}.`);
}

function removeBar(ds, index) {
  if (state.placedBars[index] === undefined) return;
  delete state.placedBars[index];
  clearCheckMarks();
  redrawGraph();
  setFeedback(`Bar removed for ${ds.graph.categories[index]}.`, "", "Placement");
  announce(`Bar removed for ${ds.graph.categories[index]}.`);
}

function findPointNear(ds, px, py, radius = 12) {
  let best = null;
  let bestDistance = Infinity;
  state.placedPoints.forEach(point => {
    const distance = Math.hypot(valueToX(ds, point.x) - px, valueToY(ds, point.y) - py);
    if (distance <= radius && distance < bestDistance) {
      best = point;
      bestDistance = distance;
    }
  });
  return best;
}

function removePoint(ds, point) {
  state.placedPoints = state.placedPoints.filter(p => p.id !== point.id);
  clearCheckMarks();
  redrawGraph();
  setFeedback(
    `Point removed. ${state.placedPoints.length} of ${ds.graph.points.length} points placed.`,
    "",
    "Placement"
  );
  announce(`Point removed at ${point.x}, ${point.y}.`);
}

function togglePoint(ds, px, py, pos) {
  const existing = findPointNear(ds, px, py);
  if (existing) {
    removePoint(ds, existing);
    return;
  }

  const total = ds.graph.points.length;
  if (state.placedPoints.length >= total) {
    setFeedback(
      `All ${total} points are placed. Click a point to remove it, or press Check Graph.`,
      "",
      "Placement"
    );
    return;
  }

  state.placedPoints.push({ id: ++pointId, x: pos.x, y: pos.y });
  clearCheckMarks();
  redrawGraph();
  setFeedback(`Point placed. ${state.placedPoints.length} of ${total} points placed.`, "", "Placement");
  announce(`Point placed at ${pos.x}, ${pos.y}.`);
}

function buildGate(ds) {
  if (state.graphCheckedCorrect) {
    lockedMessage();
    return false;
  }
  if (!graphTypeIsCorrect(ds)) {
    setFeedback("Choose the correct graph type first to reveal the graph frame.", "bad", "Graph choice");
    return false;
  }
  if (!axesAreCorrect(ds)) {
    setFeedback("Complete Steps 2–3 correctly before building the graph.", "bad", "Variables");
    return false;
  }
  return true;
}

svg.addEventListener("click", evt => {
  const ds = datasets[currentKey];
  if (!buildGate(ds)) return;

  const { x, y } = getClickCoordinates(evt);
  if (!nearPlotArea(x, y)) return;

  const pos = svgToData(ds, x, y);
  if (!pos) return;

  if (ds.graph.kind === "bar") {
    setBar(ds, pos.index, pos.y);
  } else {
    togglePoint(ds, x, y, pos);
  }
});

svg.addEventListener("pointermove", evt => {
  const ds = datasets[currentKey];
  if (!readyToBuild(ds) || evt.pointerType === "touch") return;

  const { x, y } = getClickCoordinates(evt);
  state.keyboardActive = false;
  state.hover = nearPlotArea(x, y) ? svgToData(ds, x, y) : null;
  drawOverlay();
});

svg.addEventListener("pointerleave", () => {
  state.hover = null;
  drawOverlay();
});

/* ---------- Keyboard building ---------- */

function defaultCursor(ds) {
  const graph = ds.graph;
  const yMid = snapTo(((graph.yMin || 0) + graph.yMax) / 2, graph.ySnap);
  if (graph.kind === "bar") return { index: 0, y: yMid };
  return { x: graph.xMin, y: yMid };
}

function describeCursor(ds) {
  const c = state.cursor;
  if (ds.graph.kind === "bar") {
    return `${ds.graph.categories[c.index]}, height ${c.y}.`;
  }
  return `${ds.xVar} ${c.x}, ${ds.yVar} ${c.y}.`;
}

svg.addEventListener("focus", () => {
  const ds = datasets[currentKey];
  if (!readyToBuild(ds)) return;
  if (!state.cursor) state.cursor = defaultCursor(ds);
  state.keyboardActive = true;
  drawOverlay();
  announce(`Graph builder. Cursor at ${describeCursor(ds)} Arrow keys move, Enter places or removes.`);
});

svg.addEventListener("blur", () => {
  state.keyboardActive = false;
  drawOverlay();
});

svg.addEventListener("keydown", evt => {
  const ds = datasets[currentKey];
  const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " ", "Delete", "Backspace"];
  if (!keys.includes(evt.key)) return;
  evt.preventDefault();

  if (!buildGate(ds)) return;

  const graph = ds.graph;
  if (!state.cursor) state.cursor = defaultCursor(ds);
  state.keyboardActive = true;
  const c = state.cursor;
  const yMove = evt.shiftKey ? graph.yStep : graph.ySnap;

  switch (evt.key) {
    case "ArrowUp":
      c.y = clamp(tidy(c.y + yMove), graph.yMin || 0, graph.yMax);
      break;
    case "ArrowDown":
      c.y = clamp(tidy(c.y - yMove), graph.yMin || 0, graph.yMax);
      break;
    case "ArrowLeft":
    case "ArrowRight": {
      const dir = evt.key === "ArrowRight" ? 1 : -1;
      if (graph.kind === "bar") {
        c.index = clamp(c.index + dir, 0, graph.categories.length - 1);
      } else {
        const xMove = evt.shiftKey ? graph.xStep : graph.xSnap;
        c.x = clamp(tidy(c.x + dir * xMove), graph.xMin, graph.xMax);
      }
      break;
    }
    case "Enter":
    case " ":
      if (graph.kind === "bar") {
        setBar(ds, c.index, c.y);
      } else {
        togglePoint(ds, valueToX(ds, c.x), valueToY(ds, c.y), { x: c.x, y: c.y });
      }
      return;
    case "Delete":
    case "Backspace":
      if (graph.kind === "bar") {
        removeBar(ds, c.index);
      } else {
        const near = findPointNear(ds, valueToX(ds, c.x), valueToY(ds, c.y));
        if (near) removePoint(ds, near);
      }
      return;
  }

  drawOverlay();
  announce(describeCursor(ds));
});

/* ---------- Checking the graph ---------- */

function scaleHint(ds, axis) {
  const graph = ds.graph;
  if (axis === "x") {
    return `On the x-axis, labels go up by ${graph.xStep} ${graph.xUnit} and each small gridline is ${graph.xMinor} ${graph.xUnit}.`;
  }
  return `On the y-axis, labels go up by ${graph.yStep} ${graph.yUnit} and each small gridline is ${graph.yMinor} ${graph.yUnit}.`;
}

// True when several errors share the same multiplier (allowing for rounding to the grid),
// which usually means the scale was misread.
function looksLikeScaleError(pairs, slack) {
  const usable = pairs.filter(pair => pair.target > 0);
  if (usable.length < 2) return false;
  const factor =
    usable.reduce((sum, pair) => sum + pair.placed, 0) / usable.reduce((sum, pair) => sum + pair.target, 0);
  if (factor >= 0.85 && factor <= 1.15) return false;
  return usable.every(pair => Math.abs(pair.placed - factor * pair.target) <= slack);
}

function checkBars(ds) {
  const { values, categories, yTol } = ds.graph;
  const placedCount = Object.keys(state.placedBars).length;

  if (placedCount !== values.length) {
    setFeedback(
      `Build all ${values.length} bars before checking. You have built ${placedCount}.`,
      "bad",
      "Placement"
    );
    return false;
  }

  const wrong = values
    .map((value, index) => index)
    .filter(index => Math.abs(state.placedBars[index] - values[index]) > yTol);

  state.wrongBars = new Set(wrong);
  if (!wrong.length) return true;

  redrawGraph();
  const pairs = wrong.map(i => ({ placed: state.placedBars[i], target: values[i] }));

  if (looksLikeScaleError(pairs, Math.max(ds.graph.yTol, ds.graph.ySnap))) {
    setFeedback(
      `Several bars are off by about the same factor, which usually means the scale was misread. ${scaleHint(ds, "y")}`,
      "bad",
      "Scale"
    );
  } else if (wrong.length === 1) {
    const i = wrong[0];
    const direction = state.placedBars[i] > values[i] ? "too tall" : "too short";
    setFeedback(
      `The bar for ${categories[i]} is ${direction}. Compare its top to the table value. ${scaleHint(ds, "y")}`,
      "bad",
      "Placement"
    );
  } else {
    const names = wrong.map(i => categories[i].replace("Fertilizer ", "")).join(", ");
    setFeedback(
      `The bars for ${names} don't match the table. Line up each bar top with its value. ${scaleHint(ds, "y")}`,
      "bad",
      "Placement"
    );
  }
  return false;
}

function checkPoints(ds) {
  const graph = ds.graph;
  const targets = graph.points;
  const placed = state.placedPoints;

  if (placed.length !== targets.length) {
    setFeedback(
      `Plot all ${targets.length} points before checking. You have placed ${placed.length}.`,
      "bad",
      "Placement"
    );
    return false;
  }

  // A line graph has one y-value for each x-value.
  if (graph.kind === "line") {
    const xs = placed.map(p => p.x);
    const duplicateX = xs.find((x, i) => xs.indexOf(x) !== i);
    if (duplicateX !== undefined) {
      state.wrongPoints = new Set(placed.filter(p => p.x === duplicateX).map(p => p.id));
      redrawGraph();
      setFeedback(
        `You have two points at ${ds.xVar} = ${duplicateX}. Each time in the table has only one temperature, so each x-value gets one point.`,
        "bad",
        "Placement"
      );
      return false;
    }
  }

  // Match each table value to the closest unused placed point within tolerance.
  const unmatchedPlaced = new Set(placed.map(p => p.id));
  const unmatchedTargets = [];

  targets.forEach(target => {
    let best = null;
    let bestError = Infinity;
    placed.forEach(p => {
      if (!unmatchedPlaced.has(p.id)) return;
      if (Math.abs(p.x - target.x) > graph.xTol) return;
      const error = Math.abs(p.y - target.y);
      if (error <= graph.yTol && error < bestError) {
        best = p;
        bestError = error;
      }
    });
    if (best) {
      unmatchedPlaced.delete(best.id);
    } else {
      unmatchedTargets.push(target);
    }
  });

  if (!unmatchedPlaced.size) return true;

  const wrongPoints = placed.filter(p => unmatchedPlaced.has(p.id));
  state.wrongPoints = new Set(wrongPoints.map(p => p.id));
  redrawGraph();

  // Classify each wrong point: wrong x-value, or right x-value but wrong height.
  const xErrors = [];
  const yErrors = [];
  const remainingTargets = [...unmatchedTargets];

  wrongPoints.forEach(p => {
    const sameX = remainingTargets
      .filter(t => Math.abs(t.x - p.x) <= graph.xTol)
      .sort((a, b) => Math.abs(a.y - p.y) - Math.abs(b.y - p.y));
    if (sameX.length) {
      yErrors.push({ placed: p, target: sameX[0] });
      remainingTargets.splice(remainingTargets.indexOf(sameX[0]), 1);
    } else {
      xErrors.push(p);
    }
  });

  if (xErrors.length) {
    const noun = graph.kind === "line" ? "time" : "ramp height";
    const count = xErrors.length === 1 ? "One of your points is" : `${xErrors.length} of your points are`;
    setFeedback(
      `${count} at a ${noun} that doesn't match the table. Find each x-value on the x-axis before moving up. ${scaleHint(ds, "x")}`,
      "bad",
      "Placement"
    );
    return false;
  }

  const pairs = yErrors.map(e => ({ placed: e.placed.y, target: e.target.y }));
  if (looksLikeScaleError(pairs, Math.max(graph.yTol, graph.ySnap))) {
    setFeedback(
      `Several points are off by about the same factor, which usually means the y-axis scale was misread. ${scaleHint(ds, "y")}`,
      "bad",
      "Scale"
    );
    return false;
  }

  if (yErrors.length === 1) {
    const { placed: p, target } = yErrors[0];
    const direction = p.y > target.y ? "too high" : "too low";
    setFeedback(
      `Your point at ${ds.xVar} = ${p.x} is ${direction}. The x-value is right, so check how far up you went. ${scaleHint(ds, "y")}`,
      "bad",
      "Placement"
    );
    return false;
  }

  setFeedback(
    `${yErrors.length} points are at the right x-values but the wrong heights. Read each y-value carefully. ${scaleHint(ds, "y")}`,
    "bad",
    "Placement"
  );
  return false;
}

checkGraphBtn.addEventListener("click", () => {
  const ds = datasets[currentKey];

  if (state.graphCheckedCorrect) {
    lockedMessage();
    return;
  }

  if (!graphTypeIsCorrect(ds)) {
    setFeedback("Choose the correct graph type first.", "bad", "Graph choice");
    return;
  }

  if (!choicesAreCorrect(ds)) {
    setFeedback("You need the correct axes before checking the graph.", "bad", "Variables");
    return;
  }

  const correct = ds.graph.kind === "bar" ? checkBars(ds) : checkPoints(ds);
  if (!correct) return;

  state.graphCheckedCorrect = true;
  state.hover = null;
  state.keyboardActive = false;
  clearCheckMarks();
  redrawGraph();
  showExplanation(ds);

  const names = { bar: "bar graph", line: "line graph", scatter: "scatter plot" };
  setFeedback(
    `Nice work. Your ${names[ds.graph.kind]} matches the data. Now answer the questions under the graph.`,
    "good",
    "Graph complete"
  );
  showChallenge(ds);
});

resetGraphBtn.addEventListener("click", () => {
  state.placedBars = {};
  state.placedPoints = [];
  state.graphCheckedCorrect = false;
  clearCheckMarks();
  redrawGraph();
  resetExplanation();
  hideChallenge();

  if (graphTypeIsCorrect(datasets[currentKey])) {
    setFeedback("Graph reset. Build it again.", "");
  } else {
    setFeedback("Graph reset. Choose the graph type first.", "");
  }
});

generateDatasetBtn.addEventListener("click", () => {
  regenerateCurrentDataset();
});

/* ---------- Interpretation challenge ---------- */

function hideChallenge() {
  challengeCard.hidden = true;
}

function showChallenge(ds) {
  state.challengeIndex = 0;
  challengeCard.hidden = false;
  renderQuestion(ds);
}

function renderQuestion(ds) {
  const question = ds.challenge[state.challengeIndex];
  challengeProgress.textContent = `Question ${state.challengeIndex + 1} of ${ds.challenge.length}`;
  challengePrompt.textContent = question.prompt;
  challengeFeedback.textContent = "";
  challengeFeedback.className = "feedback";
  challengeNextBtn.hidden = true;

  if (question.type === "mc") {
    challengeNumeric.hidden = true;
    challengeChoices.hidden = false;
    challengeChoices.innerHTML = "";
    question.options.forEach(option => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn";
      btn.textContent = option;
      btn.addEventListener("click", () => answerQuestion(ds, option, btn));
      challengeChoices.appendChild(btn);
    });
  } else {
    challengeChoices.hidden = true;
    challengeNumeric.hidden = false;
    challengeInput.value = "";
    challengeInput.disabled = false;
    challengeSubmit.disabled = false;
    challengeUnit.textContent = question.unit;
  }
}

function answerQuestion(ds, response, button) {
  const question = ds.challenge[state.challengeIndex];

  if (question.type === "num" && Number.isNaN(response)) {
    writeFeedback(challengeFeedback, "Enter a number, for example 12 or −2.5.", "bad", "Interpretation");
    return;
  }

  const result = question.evaluate(response);
  writeFeedback(challengeFeedback, result.message, result.correct ? "good" : "bad", "Interpretation");

  if (question.type === "mc") {
    challengeChoices.querySelectorAll(".choice-btn").forEach(btn => btn.classList.remove("active", "correct"));
    if (button) button.classList.add(result.correct ? "correct" : "active");
  }

  if (!result.correct) return;

  if (question.type === "mc") {
    challengeChoices.querySelectorAll(".choice-btn").forEach(btn => (btn.disabled = true));
  } else {
    challengeInput.disabled = true;
    challengeSubmit.disabled = true;
  }

  if (state.challengeIndex < ds.challenge.length - 1) {
    challengeNextBtn.hidden = false;
    challengeNextBtn.focus();
  } else {
    setFeedback(
      "Challenge complete. Choose another dataset, or press Generate New Dataset for fresh numbers.",
      "good",
      "Interpretation"
    );
  }
}

challengeNumeric.addEventListener("submit", evt => {
  evt.preventDefault();
  answerQuestion(datasets[currentKey], parseAnswer(challengeInput.value));
});

challengeNextBtn.addEventListener("click", () => {
  const ds = datasets[currentKey];
  state.challengeIndex += 1;
  renderQuestion(ds);
  challengePrompt.focus();
});

loadDataset();
