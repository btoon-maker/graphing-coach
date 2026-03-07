const datasets={

bar1:{
title:"Dataset 1",
prompt:"Look at the data table. Which graph type fits best?",

headers:["Fertilizer Type","Average Plant Height (cm)"],

rows:[
["Fertilizer A",14],
["Fertilizer B",19],
["Fertilizer C",11],
["Fertilizer D",16]
],

graphType:"Bar Graph",

xVar:"Fertilizer Type",
yVar:"Average Plant Height (cm)",

categories:["A","B","C","D"],
values:[14,19,11,16],

yMax:20
}

};

const graphTypes=["Bar Graph","Line Graph","Scatter Plot"];

let state={
graphType:null,
x:null,
y:null,
bars:{}
};

const svg=document.getElementById("graphSvg");
const feedback=document.getElementById("feedback");

function drawLocked(){

svg.innerHTML="";

const text=document.createElementNS("http://www.w3.org/2000/svg","text");

text.setAttribute("x",350);
text.setAttribute("y",200);
text.setAttribute("text-anchor","middle");
text.setAttribute("font-size","22");
text.textContent="Choose the correct graph type to begin";

svg.appendChild(text);

}

function drawGraph(){

if(state.graphType!=="Bar Graph"){
drawLocked();
return;
}

svg.innerHTML="";

const data=datasets.bar1;

let width=100;

data.values.forEach((v,i)=>{

let height=v*10;

let rect=document.createElementNS("http://www.w3.org/2000/svg","rect");

rect.setAttribute("x",120+i*120);
rect.setAttribute("y",350-height);
rect.setAttribute("width",width);
rect.setAttribute("height",height);
rect.setAttribute("fill","#ef476f");

svg.appendChild(rect);

let label=document.createElementNS("http://www.w3.org/2000/svg","text");

label.setAttribute("x",170+i*120);
label.setAttribute("y",350-height-5);
label.setAttribute("text-anchor","middle");
label.textContent=v;

svg.appendChild(label);

});

}

function load(){

const d=datasets.bar1;

document.getElementById("datasetTitle").innerText=d.title;
document.getElementById("datasetPrompt").innerText=d.prompt;

let table=document.getElementById("dataTable");

table.innerHTML="<tr><th>"+d.headers[0]+"</th><th>"+d.headers[1]+"</th></tr>";

d.rows.forEach(r=>{
table.innerHTML+=`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`;
});

const typeDiv=document.getElementById("graphTypeChoices");

graphTypes.forEach(t=>{

let btn=document.createElement("button");
btn.innerText=t;

btn.onclick=()=>{

state.graphType=t;

if(t==="Bar Graph"){
feedback.innerText="Correct graph type!";
}
else{
feedback.innerText="That graph type does not fit this dataset.";
}

drawGraph();

};

typeDiv.appendChild(btn);

});

drawLocked();

}

load();
