fetch("sales-data.csv")
.then(response => {
if (!response.ok) {
throw new Error("CSV file could not be loaded");
}
return response.text();
})
.then(csv => {

```
    // Convert CSV into rows
    const rows = csv.trim().split(/\r?\n/);

    // Remove header row
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

    console.log("CSV loaded:", data);

    // ==============================
    // TOTAL REVENUE
    // ==============================

    const totalRevenue = data.reduce(
        (total, item) => total + item.Revenue,
        0
    );

    // ==============================
    // TOTAL ORDERS
    // ==============================

    const totalOrders = data.length;

    // ==============================
    // COMPLETED ORDERS
    // ==============================

    const completedOrders = data.filter(
        item => item.Order_Status === "Completed"
    ).length;

    // ==============================
    // CANCELLED ORDERS
    // ==============================

    const cancelledOrders = data.filter(
        item => item.Order_Status === "Cancelled"
    ).length;

    // ==============================
    // UNIQUE CUSTOMERS
    // ==============================

    const uniqueCustomers = new Set(
        data.map(item => item.Customer)
    ).size;

    // ==============================
    // AVERAGE SHIPPING DELAY
    // ==============================

    const totalDelay = data.reduce(
        (total, item) => total + item.Shipping_Delay,
        0
    );

    const averageDelay = totalDelay / data.length;

    // ==============================
    // DISPLAY KPI DATA
    // ==============================

    document.getElementById("totalRevenue").textContent =
        "₹" + totalRevenue.toLocaleString("en-IN");

    document.getElementById("totalOrders").textContent =
        totalOrders;

    document.getElementById("completedOrders").textContent =
        completedOrders;

    document.getElementById("cancelledOrders").textContent =
        cancelledOrders;

    document.getElementById("uniqueCustomers").textContent =
        uniqueCustomers;

    document.getElementById("averageDelay").textContent =
        averageDelay.toFixed(1) + " days";


    // ==============================
    // REVENUE BY DEPARTMENT
    // ==============================

    const departmentRevenue = {};

    data.forEach(item => {

        if (!departmentRevenue[item.Department]) {
            departmentRevenue[item.Department] = 0;
        }

        departmentRevenue[item.Department] += item.Revenue;
    });

    displayData(
        "departmentRevenue",
        departmentRevenue
    );


    // ==============================
    // REVENUE BY QUARTER
    // ==============================

    const quarterRevenue = {};

    data.forEach(item => {

        if (!quarterRevenue[item.Quarter]) {
            quarterRevenue[item.Quarter] = 0;
        }

        quarterRevenue[item.Quarter] += item.Revenue;
    });

    displayData(
        "quarterRevenue",
        quarterRevenue
    );


    // ==============================
    // TOP PRODUCTS
    // ==============================

    const productRevenue = {};

    data.forEach(item => {

        if (!productRevenue[item.Product]) {
            productRevenue[item.Product] = 0;
        }

        productRevenue[item.Product] += item.Revenue;
    });

    const sortedProducts = Object.entries(productRevenue)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const topProducts = Object.fromEntries(sortedProducts);

    displayData(
        "topProducts",
        topProducts
    );

})

.catch(error => {
    console.error("Error:", error);
});
```

// ========================================
// DISPLAY DATA FUNCTION
// ========================================

function displayData(elementId, data) {

```
const container = document.getElementById(elementId);

if (!container) {
    return;
}

container.innerHTML = "";

Object.entries(data).forEach(([name, value]) => {

    const div = document.createElement("div");

    div.className = "analysis-item";

    div.innerHTML = `
        <strong>${name}</strong>
        <span>₹${value.toLocaleString("en-IN")}</span>
    `;

    container.appendChild(div);
});
```

}
