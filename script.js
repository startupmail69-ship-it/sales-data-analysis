```javascript
// ===============================
// LOAD SALES DATA
// ===============================

fetch("sales-data.csv")
    .then(response => {
        if (!response.ok) {
            throw new Error("CSV file could not be loaded");
        }

        return response.text();
    })

    .then(data => {

        // Convert CSV into rows
        const rows = data.trim().split("\n");

        // First row = column headers
        const headers = rows[0]
            .split(",")
            .map(header => header.trim().toLowerCase());

        // Convert remaining rows into objects
        const sales = rows.slice(1).map(row => {

            const values = row.split(",");

            let record = {};

            headers.forEach((header, index) => {
                record[header] = values[index]
                    ? values[index].trim()
                    : "";
            });

            return record;
        });


        console.log("Sales data loaded:", sales);


        // ===============================
        // FIND IMPORTANT COLUMNS
        // ===============================

        const revenueColumn = headers.find(column =>
            column.includes("revenue") ||
            column.includes("sales") ||
            column.includes("amount")
        );

        const orderColumn = headers.find(column =>
            column.includes("order")
        );

        const customerColumn = headers.find(column =>
            column.includes("customer")
        );

        const delayColumn = headers.find(column =>
            column.includes("delay")
        );


        // ===============================
        // TOTAL REVENUE
        // ===============================

        let totalRevenue = 0;

        if (revenueColumn) {

            totalRevenue = sales.reduce((total, sale) => {

                const value = parseFloat(
                    sale[revenueColumn]
                        ?.replace(/[₹,$]/g, "")
                );

                return total + (isNaN(value) ? 0 : value);

            }, 0);
        }


        // ===============================
        // TOTAL ORDERS
        // ===============================

        let totalOrders = sales.length;


        // ===============================
        // UNIQUE CUSTOMERS
        // ===============================

        let uniqueCustomers = 0;

        if (customerColumn) {

            const customers = new Set(
                sales
                    .map(sale => sale[customerColumn])
                    .filter(value => value)
            );

            uniqueCustomers = customers.size;
        }


        // ===============================
        // AVERAGE SHIPPING DELAY
        // ===============================

        let averageDelay = 0;

        if (delayColumn) {

            const delays = sales
                .map(sale => parseFloat(sale[delayColumn]))
                .filter(value => !isNaN(value));

            if (delays.length > 0) {

                averageDelay =
                    delays.reduce((a, b) => a + b, 0)
                    / delays.length;
            }
        }


        // ===============================
        // DISPLAY KPIs
        // ===============================

        document.getElementById("totalRevenue").textContent =
            "₹" + totalRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 0
            });

        document.getElementById("totalOrders").textContent =
            totalOrders.toLocaleString("en-IN");

        document.getElementById("uniqueCustomers").textContent =
            uniqueCustomers.toLocaleString("en-IN");

        document.getElementById("averageDelay").textContent =
            averageDelay.toFixed(1) + " days";


        // ===============================
        // CONSOLE INFORMATION
        // ===============================

        console.log("Total Revenue:", totalRevenue);
        console.log("Total Orders:", totalOrders);
        console.log("Unique Customers:", uniqueCustomers);
        console.log("Average Delay:", averageDelay);

    })


    // ===============================
    // ERROR HANDLING
    // ===============================

    .catch(error => {

        console.error("Dashboard error:", error);

    });
```
