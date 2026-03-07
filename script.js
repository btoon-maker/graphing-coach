const graphTypeOptions = ["Bar Graph", "Line Graph", "Scatter Plot"];

const datasetTemplates = {
  bar1: {
    id: "bar1",
    title: "Dataset 1",
    prompt: "Look at the data table. Which graph type fits best, and how should it be built?",
    graphType: "Bar Graph",
    variables: ["Fertilizer Type", "Average Plant Height (cm)"],
    xVar: "Fertilizer Type",
    yVar: "Average Plant Height (cm)",
    headers: ["Fertilizer Type", "Average Plant Height (cm)"],
    categories: ["Fertilizer A", "Fertilizer B", "Fertilizer C", "Fertilizer D"],
    buildSteps: [
      "Choose the best graph type.",
      "Put the categories on the x-axis.",
      "Put the measured value on the y-axis.",
      "Click in each category column to build bars to the correct height."
    ],
    explanation:
      "This is a bar graph because the x-axis shows categories: Fertilizer A, B, C, and D. The y-axis shows a measured value: average plant height in centimeters. Bar graphs are used to compare groups or categories.",
    graph: {
      kind: "bar",
      yMin: 0,
      yMax: 20,
      yStep: 5
    }
  },

  line1: {
    id: "line1",
    title: "Dataset 2",
    prompt: "Look at the data table. Which graph type fits best, and how should it be built?",
    graphType: "Line Graph",
    variables: ["Time (min)", "Water Temperature (°C)"],
    xVar: "Time (min)",
    yVar: "Water Temperature (°C)",
    headers: ["Time (min)", "Water Temperature (°C)"],
    xValues: [0, 2, 4, 6, 8],
    buildSteps: [
      "Choose the best graph type.",
      "Put the continuous variable on the x-axis.",
      "Put the measured value on the y-axis.",
      "Click near each correct point. After plotting, each point will show its coordinates."
    ],
    explanation:
      "This is a line graph because time is a continuous variable on the x-axis, and water temperature changes over time. The plotted points are connected to show a trend or pattern of change.",
    graph: {
      kind: "line",
      xMin: 0,
      xMax: 8,
      xStep: 2,
      yMin: 0,
      yMax: 100,
      yStep: 20
    }
  },

  scatter1: {
    id: "scatter1",
    title: "Dataset 3",
    prompt: "Look at the data table. Which graph type fits best, and how should it be built?",
    graphType: "Scatter Plot",
    variables: ["Ramp Height (cm)", "Distance Traveled (cm)"],
    xVar: "Ramp Height (cm)",
    yVar: "Distance Traveled (cm)",
    headers: ["Ramp Height (cm)", "Distance Traveled (cm)"],
    xValues: [10, 15, 20, 25, 30],
    buildSteps: [
      "Choose the best graph type.",
      "Put the first numerical variable on the x-axis.",
      "Put the second numerical variable on the y-axis.",
      "Click near each correct point. Each plotted point will show its coordinates."
    ],
    explanation:
      "This is a scatter plot because both variables are numerical. Ramp height and distance traveled are measured values, so plotting the points helps show whether a relationship exists between them.",
    graph: {
      kind: "scatter",
      xMin: 0,
      xMax: 30,
      xStep: 5,
      yMin: 0,
      yMax: 150,
      yStep: 30
    }
  }
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBarValues() {
  const values = [];
  while (values.length < 4) {
    const candidate = randomInt(10, 19);
    values.push(candidate);
  }
  return values;
}

function generateLinePoints() {
  const xValues = datasetTemplates.line1.xValues;
  const start = randomInt(86, 96);
  const drops = [
    randomInt(7, 11),
    randomInt(6, 10),
    randomInt(5, 9),
    randomInt(4, 8)
  ];

  const yValues = [start];
  for (let i = 0; i < drops.length; i++) {
    yValues.push(yValues[i] - drops[i]);
  }

  // Keep values sensible and within the graph scale.
  for (let i = 0; i < yValues.length; i++) {
    yValues[i] = Math.max(40, Math.min(98, yValues[i]));
  }

  return xValues.map((x, index) => ({ x, y: yValues[index] }));
}

function generateScatterPoints() {
  const xValues = datasetTemplates.scatter1.xValues;
  const points = [];

  let currentY = randomInt(42, 56);
  points.push({ x: xValues[0], y: currentY });

  for (let i = 1; i < xValues.length; i++) {
    currentY += randomInt(16, 24);
    currentY = Math.min(currentY, 145);
    points.push({ x: xValues[i], y: currentY });
  }

  return points;
}

function buildDatasetFromTemplate(templateKey) {
  const template = datasetTemplates[templateKey];

  if (templateKey === "bar1") {
    const values = generateBarValues();
    return {
      ...template,
      rows: template.categories.map((category, index) => [category, String(values[index])]),
      graph: {
        ...template.graph,
        categories: [...template.categories],
        values
      }
    };
  }

  if (templateKey === "line1") {
    const points = generateLinePoints();
    return {
      ...template,
      rows: points.map(point => [String(point.x), String(point.y)]),
      graph: {
        ...template.graph,
        points
      }
    };
  }

  if (templateKey === "scatter1") {
    const points = generateScatterPoints();
    return {
      ...template,
      rows: points.map(point => [String(point.x), String(point.y)]),
      graph: {
        ...template.graph,
        points
      }
    };
  }

  return null;
}

let datasets = {
  bar1: buildDatasetFromTemplate("bar1"),
  line1: buildDatasetFromTemplate("line1"),
  scatter1: buildDatasetFromTemplate("scatter1")
};

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

const svgNS = "http://www.w3.org/2000/svg";

let currentKey = "bar1";
let state = {};

const plotArea = {
  left: 90,
  top: 35,
  width: 520,
  height: 280
};

function resetState() {
  state = {
    graphTypeChoice: null,
    xChoice: null,
    yChoice: null,
    placedBars: {},
    placedPoints: [],
    graphCheckedCorrect: false
  };
}

function resetExplanation() {
  explanationText.textContent = "Check a completed graph to see an explanation here.";
}

function showExplanation(ds) {
  explanationText.textContent = ds.explanation;
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.className = "feedback";
}

function setFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`.trim();
}

function initDatasetButtons() {
  datasetButtons.innerHTML = "";
  Object.values(datasets).forEach(ds => {
    const btn = document.createElement("button");
    btn.className = `dataset-btn ${ds.id === currentKey ? "active" : ""}`;
    btn.textContent = ds.title;
    btn.type = "button";
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
    btn.addEventListener("click", () => handler(option));
    container.appendChild(btn);
  });
}

function renderAllChoices(ds) {
  renderChoiceButtons(graphTypeChoices, graphTypeOptions, state.graphTypeChoice, (choice) => {
    state.graphTypeChoice = choice;
    if (choice === ds.graphType) {
      setFeedback("Correct graph type. The graph frame is now revealed.", "good");
    } else {
      setFeedback("Not quite. Look again at the data table and what the graph needs to show.", "bad");
    }
    redrawGraph();
    renderAllChoices(ds);
  });

  renderChoiceButtons(xAxisChoices, ds.variables, state.xChoice, (choice) => {
    state.xChoice = choice;
    if (choice === ds.xVar) {
      setFeedback("Correct x-axis choice.", "good");
    } else {
      setFeedback("That is not the best x-axis choice for this dataset.", "bad");
    }
    redrawGraph();
    renderAllChoices(ds);
  });

  renderChoiceButtons(yAxisChoices, ds.variables, state.yChoice, (choice) => {
    state.yChoice = choice;
    if (choice === ds.yVar) {
      setFeedback("Correct y-axis choice.", "good");
    } else {
      setFeedback("That is not the best y-axis choice for this dataset.", "bad");
    }
    redrawGraph();
    renderAllChoices(ds);
  });
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

function drawText(x, y, text, size = 14, weight = "normal", fill = "#334155", anchor = "start") {
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
  svg.appendChild(t);
  return t;
}

function drawLockedPrompt() {
  clearSvg();

  const bg = createSvgElement("rect", {
    x: 0,
    y: 0,
    width: 700,
    height: 420,
    fill: "white"
  });
  svg.appendChild(bg);

  const box = createSvgElement("rect", {
    x: 95,
    y: 95,
    width: 510,
    height: 190,
    rx: 22,
    fill: "#f7f9ff",
    stroke: "#dbe6f2",
    "stroke-width": 2
  });
  svg.appendChild(box);

  drawText(350, 155, "Complete Step 1 First", 28, "bold", "#6c63ff", "middle");
  drawText(350, 195, "Choose the correct graph type to reveal the graph frame.", 18, "normal", "#4b5563", "middle");
  drawText(350, 230, "Variable labels will appear after Steps 2 and 3 are correct.", 18, "normal", "#4b5563", "middle");
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

function drawBaseAxes(ds) {
  clearSvg();

  const bg = createSvgElement("rect", {
    x: 0,
    y: 0,
    width: 700,
    height: 420,
    fill: "white"
  });
  svg.appendChild(bg);

  const graph = ds.graph;
  const yTicks = Math.floor((graph.yMax - (graph.yMin || 0)) / graph.yStep);

  for (let i = 1; i < yTicks; i++) {
    const y = plotArea.top + plotArea.height - (i / yTicks) * plotArea.height;
    const line = createSvgElement("line", {
      x1: plotArea.left,
      y1: y,
      x2: plotArea.left + plotArea.width,
      y2: y,
      stroke: "#e4ebf5",
      "stroke-width": 1
    });
    svg.appendChild(line);
  }

  svg.appendChild(createSvgElement("line", {
    x1: plotArea.left,
    y1: plotArea.top,
    x2: plotArea.left,
    y2: plotArea.top + plotArea.height,
    stroke: "#334155",
    "stroke-width": 2
  }));

  svg.appendChild(createSvgElement("line", {
    x1: plotArea.left,
    y1: plotArea.top + plotArea.height,
    x2: plotArea.left + plotArea.width,
    y2: plotArea.top + plotArea.height,
    stroke: "#334155",
    "stroke-width": 2
  }));

  for (let value = graph.yMin || 0; value <= graph.yMax; value += graph.yStep) {
    const y = valueToY(ds, value);
    drawText(plotArea.left - 16, y + 5, String(value), 13, "bold", "#334155", "end");
  }

  if (axesAreCorrect(ds)) {
    drawText(
      plotArea.left + plotArea.width - 10,
      plotArea.top + plotArea.height + 35,
      ds.xVar,
      14,
      "bold",
      "#334155",
      "end"
    );

    const yLabel = createSvgElement("text", {
      x: 28,
      y: plotArea.top + plotArea.height / 2 + 20,
      fill: "#334155",
      "font-size": 14,
      "font-weight": "bold",
      "font-family": "Arial, Helvetica, sans-serif",
      transform: `rotate(-90 28 ${plotArea.top + plotArea.height / 2 + 20})`,
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
      plotArea.top + plotArea.height + 20,
      category.replace("Fertilizer ", ""),
      13,
      "bold",
      "#334155",
      "middle"
    );

    const rect = createSvgElement("rect", {
      x: plotArea.left + slotWidth * index + 18,
      y: plotArea.top,
      width: slotWidth - 36,
      height: plotArea.height,
      fill: "rgba(239, 71, 111, 0.05)",
      stroke: "rgba(239, 71, 111, 0.12)"
    });
    svg.appendChild(rect);
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

    const bar = createSvgElement("rect", {
      x,
      y,
      width,
      height,
      fill: "#ef476f"
    });
    svg.appendChild(bar);

    drawText(x + width / 2, y - 8, String(value), 14, "bold", "#ef476f", "middle");
  });
}

function drawLineOrScatterFrame(ds) {
  drawBaseAxes(ds);

  const graph = ds.graph;
  for (let value = graph.xMin; value <= graph.xMax; value += graph.xStep) {
    const x = valueToX(ds, value);
    drawText(x, plotArea.top + plotArea.height + 20, String(value), 13, "bold", "#334155", "middle");
  }
}

function drawPlacedPoints(ds) {
  const graph = ds.graph;

  if (graph.kind === "line" && state.graphCheckedCorrect && state.placedPoints.length) {
    const sorted = [...state.placedPoints].sort((a, b) => a.x - b.x);
    const pointsString = sorted.map(p => `${valueToX(ds, p.x)},${valueToY(ds, p.y)}`).join(" ");
    const line = createSvgElement("polyline", {
      points: pointsString,
      fill: "none",
      stroke: "#6c63ff",
      "stroke-width": 3
    });
    svg.appendChild(line);
  }

  state.placedPoints.forEach(point => {
    const cx = valueToX(ds, point.x);
    const cy = valueToY(ds, point.y);

    const circle = createSvgElement("circle", {
      cx,
      cy,
      r: 6,
      fill: graph.kind === "line" ? "#6c63ff" : "#00bcd4"
    });
    svg.appendChild(circle);

    drawText(
      cx + 10,
      cy - 10,
      `(${point.x}, ${point.y})`,
      12,
      "bold",
      graph.kind === "line" ? "#6c63ff" : "#00bcd4",
      "start"
    );
  });
}

function redrawGraph() {
  const ds = datasets[currentKey];

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
}

function loadDataset() {
  const ds = datasets[currentKey];
  resetState();
  initDatasetButtons();
  renderTable(ds);
  renderBuildSteps(ds);
  renderAllChoices(ds);
  redrawGraph();
  resetExplanation();
  datasetTitle.textContent = ds.title;
  datasetPrompt.textContent = ds.prompt;
  setFeedback("Use the data table to decide the graph type first.", "");
}

function regenerateCurrentDataset() {
  datasets[currentKey] = buildDatasetFromTemplate(currentKey);
  const ds = datasets[currentKey];

  resetState();
  initDatasetButtons();
  renderTable(ds);
  renderBuildSteps(ds);
  renderAllChoices(ds);
  redrawGraph();
  resetExplanation();
  datasetTitle.textContent = ds.title;
  datasetPrompt.textContent = ds.prompt;
  clearFeedback();
}

function getClickCoordinates(evt) {
  const rect = svg.getBoundingClientRect();
  const scaleX = 700 / rect.width;
  const scaleY = 420 / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

function insidePlotArea(x, y) {
  return (
    x >= plotArea.left &&
    x <= plotArea.left + plotArea.width &&
    y >= plotArea.top &&
    y <= plotArea.top + plotArea.height
  );
}

function handleBarClick(ds, x, y) {
  const categories = ds.graph.categories;
  const slotWidth = plotArea.width / categories.length;
  const index = Math.floor((x - plotArea.left) / slotWidth);

  if (index < 0 || index >= categories.length) return;

  const proportion = (plotArea.top + plotArea.height - y) / plotArea.height;
  let value = proportion * ds.graph.yMax;
  value = Math.max(0, Math.min(ds.graph.yMax, Math.round(value)));

  state.placedBars[index] = value;
  redrawGraph();
  setFeedback(`Bar placed for ${categories[index]} at ${value}.`, "");
}

function handlePointClick(ds, x, y) {
  const remaining = ds.graph.points.filter(
    target => !state.placedPoints.some(p => p.x === target.x && p.y === target.y)
  );

  let bestTarget = null;
  let bestDistance = Infinity;

  remaining.forEach(target => {
    const px = valueToX(ds, target.x);
    const py = valueToY(ds, target.y);
    const distance = Math.hypot(px - x, py - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestTarget = target;
    }
  });

  if (bestTarget && bestDistance <= 22) {
    state.placedPoints.push(bestTarget);
    redrawGraph();
    setFeedback(`Point added at (${bestTarget.x}, ${bestTarget.y}).`, "");
  } else {
    setFeedback("Click closer to a correct point on the graph.", "bad");
  }
}

svg.addEventListener("click", (evt) => {
  const ds = datasets[currentKey];

  if (!graphTypeIsCorrect(ds)) {
    setFeedback("Choose the correct graph type first to reveal the graph frame.", "bad");
    return;
  }

  if (!choicesAreCorrect(ds)) {
    setFeedback("Complete Steps 2–3 correctly before building the graph.", "bad");
    return;
  }

  const { x, y } = getClickCoordinates(evt);
  if (!insidePlotArea(x, y)) return;

  if (ds.graph.kind === "bar") {
    handleBarClick(ds, x, y);
  } else {
    handlePointClick(ds, x, y);
  }
});

checkGraphBtn.addEventListener("click", () => {
  const ds = datasets[currentKey];

  if (!graphTypeIsCorrect(ds)) {
    setFeedback("Choose the correct graph type first.", "bad");
    return;
  }

  if (!choicesAreCorrect(ds)) {
    setFeedback("You need the correct axes before checking the graph.", "bad");
    return;
  }

  if (ds.graph.kind === "bar") {
    const correctValues = ds.graph.values;
    const placedIndexes = Object.keys(state.placedBars).length;

    if (placedIndexes !== correctValues.length) {
      setFeedback("Build all bars before checking the graph.", "bad");
      return;
    }

    const allCorrect = correctValues.every((value, index) => {
      const placed = state.placedBars[index];
      return placed !== undefined && Math.abs(placed - value) <= 1;
    });

    if (allCorrect) {
      state.graphCheckedCorrect = true;
      redrawGraph();
      showExplanation(ds);
      setFeedback("Nice work. Your bar graph is correct.", "good");
    } else {
      setFeedback("Some bar heights are off. Adjust the bars and try again.", "bad");
    }
  } else {
    if (state.placedPoints.length !== ds.graph.points.length) {
      setFeedback("Plot all points before checking the graph.", "bad");
      return;
    }

    state.graphCheckedCorrect = true;
    redrawGraph();
    showExplanation(ds);

    if (ds.graph.kind === "line") {
      setFeedback("Nice work. Your line graph is correct.", "good");
    } else {
      setFeedback("Nice work. Your scatter plot is correct.", "good");
    }
  }
});

resetGraphBtn.addEventListener("click", () => {
  state.placedBars = {};
  state.placedPoints = [];
  state.graphCheckedCorrect = false;
  redrawGraph();
  resetExplanation();

  if (graphTypeIsCorrect(datasets[currentKey])) {
    setFeedback("Graph reset. Build it again.", "");
  } else {
    setFeedback("Graph reset. Choose the graph type first.", "");
  }
});

generateDatasetBtn.addEventListener("click", () => {
  regenerateCurrentDataset();
});

loadDataset();
