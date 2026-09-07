fetch("sales-data.csv")
.then(response => {
if (!response.ok) {
throw new Error("CSV file could not be loaded");
}
return response.text();
})
.then(csv => {

```
    const rows = csv.trim().split(/\r?\n/);

    const data = rows.slice(1).map(row => {

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

    // ==============================
    // KPI CALCULATIONS
    // ==============================

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

    const uniqueCustomers = new Set(
        data.map(item => item.Customer)
    ).size;

    const averageDelay =
        data.reduce(
            (sum, item) => sum + item.Shipping_Delay,
            0
        ) / data.length;


    // ==============================
    // DISPLAY KPIs
    // ==============================

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


    // ==============================
    // REVENUE BY DEPARTMENT
    // ==============================

    const departmentRevenue = {};

    data.forEach(item => {

        departmentRevenue[item.Department] =
            (departmentRevenue[item.Department] || 0)
            + item.Revenue;

    });


    // ==============================
    // REVENUE BY QUARTER
    // ==============================

    const quarterRevenue = {};

    data.forEach(item => {

        quarterRevenue[item.Quarter] =
            (quarterRevenue[item.Quarter] || 0)
            + item.Revenue;

    });


    // ==============================
    // REVENUE BY PRODUCT
    // ==============================

    const productRevenue = {};

    data.forEach(item => {

        productRevenue[item.Product] =
            (productRevenue[item.Product] || 0)
            + item.Revenue;

    });

    const topProducts = Object.entries(productRevenue)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);


    // ==============================
    // ORDER STATUS
    // ==============================

    const orderStatus = {};

    data.forEach(item => {

        orderStatus[item.Order_Status] =
            (orderStatus[item.Order_Status] || 0) + 1;

    });


    // ==============================
    // CHART 1
    // REVENUE BY DEPARTMENT
    // ==============================

    new Chart(
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


    // ==============================
    // CHART 2
    // REVENUE BY QUARTER
    // ==============================

    const quarterOrder = ["Q1", "Q2", "Q3", "Q4"];

    new Chart(
        document.getElementById("quarterChart"),
        {
            type: "line",

            data: {
                labels: quarterOrder,

                datasets: [{
                    label: "Revenue",

                    data: quarterOrder.map(
                        quarter => quarterRevenue[quarter] || 0
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


    // ==============================
    // CHART 3
    // TOP 5 PRODUCTS
    // ==============================

    new Chart(
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


    // ==============================
    // CHART 4
    // ORDER STATUS
    // ==============================

    new Chart(
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


    console.log("Dashboard loaded successfully!");
    console.log(data);

})

.catch(error => {
    console.error("Error:", error);
});
```
