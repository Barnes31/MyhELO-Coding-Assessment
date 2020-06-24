console.log('Visualization.js Running...');
/**
 * Visualize the results of an API call to the FDA.
 */
component.visualization = function () {
  component.apply(this, arguments);
};
assessment.extend(component.visualization, component);

/**
 * Decorate.
 *
 * @param {HTMLDivElement} parent
 */
component.visualization.prototype.decorate = function (parent) {
  var self = this;
  var container = document.createElement('div');
  parent.appendChild(container);
  container.classList.add("script");


  /**
   * Here are some other ideas:
   *
   * Route summary for all human prescription drugs
   * https://api.fda.gov/drug/label.json?search=openfda.product_type.exact:"HUMAN PRESCRIPTION DRUG"&count=openfda.route.exact
   *
   * Brand names for all drugs containing ibuprofen as an active ingredient
   * https://api.fda.gov/drug/label.json?search=active_ingredient:ibuprofen&count=openfda.brand_name.exact
   *
   * Routes for all drugs that treat headaches
   * https://api.fda.gov/drug/label.json?search=indications_and_usage:headache&count=openfda.route.exact
   *
   * Manufacturers of all congestion medications
   * https://api.fda.gov/drug/label.json?search=indications_and_usage:congestion&count=openfda.manufacturer_name.exact
   *
   * Substances contained in medications that have a warning for dizziness
   * https://api.fda.gov/drug/label.json?search=warnings:dizziness&count=openfda.substance_name.exact
   *
   * Frequency of boxed warning use over time
   * https://api.fda.gov/drug/label.json?search=effective_time:20090601+TO+20181008&count=effective_time
   * https://api.fda.gov/drug/label.json?search=(effective_time:20090601+TO+20181008)+AND+_exists_:boxed_warning&count=effective_time
   *
   * Frequency of the phrase "ice cream" in food recalls grouped by recalling company
   * https://api.fda.gov/food/enforcement.json?search=reason_for_recall:%22ice+cream%22&count=recalling_firm.exact
   */
  assessment.fda_api(
    `https://api.fda.gov/food/enforcement.json?search=reason_for_recall:%22ice+cream%22&count=recalling_firm.exact`,
    function (data) {
      self.data = data;
      self.decorate_data(container);
    }
  );
};

/**
 * TODO
 *
 * @param {HTMLElement} parent
 */
component.visualization.prototype.decorate_data = function (parent) {
  var nameList = [];
  var countList = [];
  this.data.forEach(drug => {
    var name = '';
    var count = 0;

    // set selected default
    name = drug['term'];
    count = drug['count'];

    nameList.push(name);
    countList.push(count);
  })
  var colors = ['rgb(33, 150, 243)'];
  var i = 0;
  html = `
    <!-- GRAPH -->
    <h3>Frequency of the phrase "ice cream" in food recalls grouped by recalling company</h2>
    <canvas id="myChart" width="400" height="400"></canvas>
    `
  parent.insertAdjacentHTML('beforeend', html);
  nameList.forEach(name => {
    // Random HSL numbers
    let h = Math.floor(Math.random() * 360);
    let s = Math.floor(Math.random() * 100);
    let l = Math.floor(Math.random() * 100);
    // Combine random numbers
    let hsl = `hsl(${h}, ${s}%, ${l}%)`;
    colors.push(hsl);
  })
//   Chart Details
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: nameList,
      datasets: [{
        label: `Frequency of use of the phrase 'ice cream'`,
        data: countList,
        backgroundColor: colors,
        borderWidth: 3
      }]
    },
    options: {
      cutoutPercentage: 50,
      barPercentage: 0.5,
      barThickness: 0,
      maxBarThickness: 8,
      minBarLength: 2,
      legend: {
        display: false,
      }
    }
  });
};
