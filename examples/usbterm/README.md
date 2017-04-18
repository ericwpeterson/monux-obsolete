
# react-d3-boxplot

This example builds off of colors example. It uses a get action for getting a list of stats, and a call action for getting a list of points for a line graph. It wraps the monobject reducer to intercept a specific OP_COMPLETED response. Once received, it groups the stats by year, month, week, and days. Clicking each boxplot item drills down into the next group of box plots.

## Screenshot

![](boxplot.gif)

## Instructions

  Open two terminals.

  In first terminal
  cd server
  npm install
  npm start

  In second terminal
  cd client
  npm install
  webpack-dev-server --host 0.0.0.0

  browser http://IPADDR:8080
