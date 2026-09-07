// ========================================
// SALES DATA ANALYSIS DASHBOARD
// ========================================

fetch("sales-data.csv")
.then(response => {
if (!response.ok) {
throw new Error("Could not load sales-data.csv");
}
return response.text();
})
.then(csv => {

```
    // Convert CSV into rows
    const rows = csv.trim().split("\n");

    // Get headers
    const headers = rows[0].split(",");

    // Convert each row into an object
    const data = rows.slice(1).map(row => {

        const values = row.split(",");

        return {
            Department: values[0],
            Quarter: values[1],
            Revenue: Number(values[2]),
            Product: values[3],
            Customer: values[4],
            Shipping_Mode: values[5],
            Shipping_Delay: Number(values[6]),
            Order_Status: values[7]
        };
    });

    // ========================================
    // KPI CALCULATIONS
    // ========================================

    // Total Revenue
    const totalRevenue = data.reduce(
        (sum, item) => sum + item.Revenue,
        0
    );

    // Total Orders
    const totalOrders = data.length;

    // Unique Customers
    const uniqueCustomers = new Set(
        data.map(item => item.Customer)
    ).size;

    // Average Shipping Delay
    const averageDelay =
        data.reduce(
            (sum, item) => sum + item.Shipping_Delay,
            0
        ) / data.length;

    // Completed Orders
    const completedOrders = data.filter(
        item => item.Order_Status === "Completed"
    ).length;

    // Cancelled Orders
    const cancelledOrders = data.filter(
        item => item.Order_Status === "Cancelled"
    ).length;


    // ========================================
    // DISPLAY KPI VALUES
    // ========================================

    document.getElementById("totalRevenue").textContent =
        "₹" + totalRevenue.toLocaleString("en-IN");

    document.getElementById("totalOrders").textContent =
        totalOrders;

    document.getElementById("uniqueCustomers").textContent =
        uniqueCustomers;

    document.getElementById("averageDelay").textContent =
        averageDelay.toFixed(1) + " days";


    // ========================================
    // REVENUE BY DEPARTMENT
    // ========================================

    const departmentRevenue = {};

    data.forEach(item => {

        if (!departmentRevenue[item.Department]) {
            departmentRevenue[item.Department] = 0;
        }

        departmentRevenue[item.Department] += item.Revenue;
    });

    displayResults(
        "departmentRevenue",
        departmentRevenue
    );


    // ========================================
    // REVENUE BY QUARTER
    // ========================================

    const quarterRevenue = {};

    data.forEach(item => {

        if (!quarterRevenue[item.Quarter]) {
            quarterRevenue[item.Quarter] = 0;
        }

        quarterRevenue[item.Quarter] += item.Revenue;
    });

    displayResults(
        "quarterRevenue",
        quarterRevenue
    );


    // ========================================
    // TOP PRODUCTS
    // ========================================

    const productRevenue = {};

    data.forEach(item => {

        if (!productRevenue[item.Product]) {
            productRevenue[item.Product] = 0;
        }

        productRevenue[item.Product] += item.Revenue;
    });

    const topProducts =
        Object.entries(productRevenue)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

    displayResults(
        "topProducts",
        Object.fromEntries(topProducts)
    );


    // ========================================
    // CONSOLE INFORMATION
    // ========================================

    console.log("Sales data loaded successfully!");
    console.log("Total Revenue:", totalRevenue);
    console.log("Total Orders:", totalOrders);
    console.log("Unique Customers:", uniqueCustomers);
    console.log("Average Shipping Delay:", averageDelay);
    console.log("Completed Orders:", completedOrders);
    console.log("Cancelled Orders:", cancelledOrders);
    console.log("Revenue by Department:", departmentRevenue);
    console.log("Revenue by Quarter:", quarterRevenue);
    console.log("Top Products:", topProducts);

})

.catch(error => {
    console.error("Error loading sales data:", error);
});
```

// ========================================
// DISPLAY RESULTS FUNCTION
// ========================================

function displayResults(elementId, results) {

```
const container = document.getElementById(elementId);

if (!container) {
    return;
}

container.innerHTML = "";

Object.entries(results).forEach(([name, revenue]) => {

    const item = document.createElement("div");

    item.className = "analysis-item";

    item.innerHTML = `
        <strong>${name}</strong>
        <span>₹${revenue.toLocaleString("en-IN")}</span>
    `;

    container.appendChild(item);
});
```

}
