let salesData = [];

let departmentChart;
let quarterChart;
let productChart;
let statusChart;

// ========================================
// LOAD CSV
// ========================================

fetch("sales-data.csv")
.then(response => {

```
    if (!response.ok) {
        throw new Error("Could not load sales-data.csv");
    }

    return response.text();
})

.then(csv => {

    const rows = csv.trim().split(/\r?\n/);

    salesData = rows.slice(1).map(row => {

        const values = row.split(",");

        return {
            Department: values[0].trim(),
            Quarter: values[1].trim(),
            Revenue: Number(values[2].trim()),
            Product: values[3].trim(),
            Customer: values[4].trim(),
            Shipping_Mode: values[5].trim(),
            Shipping_Delay: Number(values[6].trim()),
            Order_Status: values[7].trim()
        };

    });

    console.log("Sales data loaded:", salesData);

    // Initial dashboard
    updateDashboard(salesData);

    // Filters
    document
        .getElementById("departmentFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("quarterFilter")
        .addEventListener("change", applyFilters);

})

.catch(error => {
    console.error("Error loading data:", error);
});
```

// ========================================
// FILTER DATA
// ========================================

function applyFilters() {

function applyFilters() {

    const selectedDepartment =
        document.getElementById("departmentFilter").value;

    const selectedQuarter =
        document.getElementById("quarterFilter").value;

    const selectedShipping =
        document.getElementById("shippingFilter").value;

const filteredData = salesData.filter(item => {

    const departmentMatch =
        selectedDepartment === "All" ||
        item.Department === selectedDepartment;

    const quarterMatch =
        selectedQuarter === "All" ||
        item.Quarter === selectedQuarter;

    return departmentMatch && quarterMatch;

});


updateDashboard(filteredData);
```

}

// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard(data) {

```
if (data.length === 0) {

    document.getElementById("totalRevenue").textContent = "₹0";

    document.getElementById("totalOrders").textContent = "0";

    document.getElementById("completedOrders").textContent = "0";

    document.getElementById("cancelledOrders").textContent = "0";

    document.getElementById("averageDelay").textContent = "0 days";

    return;
}


// ========================================
// KPIs
// ========================================

const totalRevenue = data.reduce(
    (sum, item) => sum + item.Revenue,
    0
);


const totalOrders = data.length;


const completedOrders = data.filter(
    item => item.Order_Status === "Completed"
).length;


const cancelledOrders = data.filter(
    item => item.Order_Status === "Cancelled"
).length;


const averageDelay =
    data.reduce(
        (sum, item) => sum + item.Shipping_Delay,
        0
    ) / data.length;


// ========================================
// DISPLAY KPIs
// ========================================

document.getElementById("totalRevenue").textContent =
    "₹" + totalRevenue.toLocaleString("en-IN");


document.getElementById("totalOrders").textContent =
    totalOrders;


document.getElementById("completedOrders").textContent =
    completedOrders;


document.getElementById("cancelledOrders").textContent =
    cancelledOrders;


document.getElementById("averageDelay").textContent =
    averageDelay.toFixed(1) + " days";
document
    .getElementById("shippingFilter")
    .addEventListener("change", applyFilters);

// ========================================
// DEPARTMENT REVENUE
// ========================================

const departmentRevenue = {};

data.forEach(item => {

    departmentRevenue[item.Department] =
        (departmentRevenue[item.Department] || 0)
        + item.Revenue;

});


// ========================================
// QUARTER REVENUE
// ========================================

const quarterRevenue = {};

data.forEach(item => {

    quarterRevenue[item.Quarter] =
        (quarterRevenue[item.Quarter] || 0)
        + item.Revenue;

});


// ========================================
// PRODUCT REVENUE
// ========================================

const productRevenue = {};

data.forEach(item => {

    productRevenue[item.Product] =
        (productRevenue[item.Product] || 0)
        + item.Revenue;

});


const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);


// ========================================
// ORDER STATUS
// ========================================

const orderStatus = {};

data.forEach(item => {

    orderStatus[item.Order_Status] =
        (orderStatus[item.Order_Status] || 0) + 1;

});


// ========================================
// UPDATE CHARTS
// ========================================

updateCharts(
    departmentRevenue,
    quarterRevenue,
    topProducts,
    orderStatus
);
```

}

// ========================================
// UPDATE CHARTS
// ========================================

function updateCharts(
departmentRevenue,
quarterRevenue,
topProducts,
orderStatus
) {

```
// Destroy old charts
if (departmentChart) departmentChart.destroy();

if (quarterChart) quarterChart.destroy();

if (productChart) productChart.destroy();

if (statusChart) statusChart.destroy();


// ========================================
// DEPARTMENT CHART
// ========================================

departmentChart = new Chart(
    document.getElementById("departmentChart"),
    {
        type: "bar",

        data: {
            labels: Object.keys(departmentRevenue),

            datasets: [{
                label: "Revenue",

                data: Object.values(departmentRevenue)
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
);


// ========================================
// QUARTER CHART
// ========================================

const quarters = ["Q1", "Q2", "Q3", "Q4"];


quarterChart = new Chart(
    document.getElementById("quarterChart"),
    {
        type: "line",

        data: {
            labels: quarters,

            datasets: [{
                label: "Revenue",

                data: quarters.map(
                    quarter =>
                        quarterRevenue[quarter] || 0
                ),

                tension: 0.3
            }]
        },

        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
);


// ========================================
// PRODUCT CHART
// ========================================

productChart = new Chart(
    document.getElementById("productChart"),
    {
        type: "bar",

        data: {
            labels: topProducts.map(
                product => product[0]
            ),

            datasets: [{
                label: "Revenue",

                data: topProducts.map(
                    product => product[1]
                )
            }]
        },

        options: {
            responsive: true,

            indexAxis: "y",

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    }
);


// ========================================
// STATUS CHART
// ========================================

statusChart = new Chart(
    document.getElementById("statusChart"),
    {
        type: "doughnut",

        data: {
            labels: Object.keys(orderStatus),

            datasets: [{
                label: "Orders",

                data: Object.values(orderStatus)
            }]
        },

        options: {
            responsive: true
        }
    }
);
```

}
