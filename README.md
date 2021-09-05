# Leaflet Challenge
## Leaflet Homework - Visualizing Data with Leaflet
## To view the interactive map click [here](https://lp-116.github.io/leaflet-challenge/)

---
### Task

Using an earthquake dataset from the United State Geological Survey (USGS), create a visualisation based using Leaflet.

For __Step1__ create a map that plots all the earthquakes for the data set based on their latitude and longitude.
The data markers need to reflect the magnitude of the earthquake by their size and the depth of the earthquake by color.
Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
Include popups that provide additional information about the earthquake when a marker is clicked.
A legend also needs to be provided for the map.

For __Step2__ plot a second dataset showing tectonic plates onto the map created in step 1.
Add a number of base maps to choose from and create overlays for the earthquake and tectonic plate data sets.

---
### Method

The maps have been created using the data from the past 7 days.
Dataset used: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

The datasets are read by using d3.json and parsing each url. A response is then returned which we can then use to access the data.
The circle markers are created by creating a geoJson layer based on the response and returning a circle marker. 
Styling is applied to the circle markers by using the magnitude of the earthquake for the radius of the circle (multiplied by 4 to give a decent size) and the color is determined by the depth of the earthquake. In order to apply the color, a separate function was defined. The function used a switch method to return a color based on the depth value.

An onEachFeature function was created to generate the popup box when a marker is clicked.
For a cleaner look in the popup box, the split and pop() methods were used on the "place" result to display the state and country. 
e.g.

__Before__
<img src="https://user-images.githubusercontent.com/82348616/132117396-70ed99fc-f2d8-4605-ac16-76c0e552e57e.PNG" width="300">
__After__
<img src="https://user-images.githubusercontent.com/82348616/132117980-8adaad02-6f3b-4ffb-983d-f38e62892f37.PNG" width="250">

The legend is created using L.control. The grades are defined in a list and a legendColor function is defined that returns the colors for the legend.
The grades are iterated through by using a for loop, getting the matching color for each grade and then creating the text for each grade.

Note that this code needed to be added to the css file to get the legend to display properly:

"div.info.legend.leaflet-control br { clear: both; }"

Without this code, the colors did not appear in line with the text. 

A grayscale layer and initial map are defined and the circle markers and legends are added to the map. 

For step2 there are a further 2 layers defined (a satellite layer and outdoors layer), the basemaps object is defined to capture all layers and the overlayMaps object is created to hold the earthquake and tectonic plates layers. Layers is also added to the initial map setup to define what appears upon loading. Finally, the control layer is added to the map to display the map control options. 


---
### Results

Map with layers, earthquake markers and tectonic lines created successfully.

<img src="https://user-images.githubusercontent.com/82348616/132116190-471486c5-295d-4670-9e59-18777da92558.PNG" width="700">

The webpage has been deployed on Github and can be accessed [here](https://lp-116.github.io/leaflet-challenge/)

---
### Files

The main branch of this repository contains the below:

* Leaflet - Step1 folder: the code for part 1 of this assignment.
* Leaflet - Step2 folder: the code for part 2 of this assignment.
* A static folder and index.html file used to deploy part 2 to Github.

To run the script on your local machine, clone the branch to your computer and then navigate to the folder contain the index.html file of the code you want to run.
In your computer terminal input __python -m http.server__ to establish a local connection and open the link provided.

